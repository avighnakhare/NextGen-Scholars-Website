import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { query, initDb } from './database.js';
import { sendConfirmationEmail, sendAdminNotification, sendCancellationEmail, sendContactEmail } from './email.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize Database
await initDb().catch((err) => {
  console.error('Failed to initialize database:', err);
});

// Admin JWT Middleware
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Session expired or invalid token. Please log in again.' });
    }
    req.admin = decoded;
    next();
  });
}

/* ==========================================================================
   PUBLIC CALENDAR BOOKING API ENDPOINTS
   ========================================================================== */

// 1. Get taken slots for a given date
app.get('/api/bookings/taken', async (req, res) => {
  const { date } = req.query; // Expects YYYY-MM-DD
  if (!date) {
    return res.status(400).json({ message: 'Date parameter is required' });
  }

  try {
    const bookings = await query.all(
      'SELECT booking_time FROM registrations WHERE booking_date = ?',
      [date]
    );
    const takenTimes = bookings.map(b => b.booking_time);
    res.json({ date, takenTimes });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Database error fetching bookings' });
  }
});

// 2. Register a calendar slot
app.post('/api/bookings/register', async (req, res) => {
  const {
    bookingDate, bookingTime, studentName, parentName, studentEmail, parentEmail, phone,
    grade, school, city, state, interests, goals, referral, gpa, extracurriculars, targetPrograms
  } = req.body;

  if (!bookingDate || !bookingTime || !studentName || !parentName || !studentEmail || !parentEmail || !phone || !grade || !school || !city || !state || !interests || !goals || !referral) {
    return res.status(400).json({ message: 'Missing required registration fields' });
  }

  try {
    // 1. Check if slot is already taken
    const existing = await query.get(
      'SELECT id FROM registrations WHERE booking_date = ? AND booking_time = ?',
      [bookingDate, bookingTime]
    );

    if (existing) {
      return res.status(400).json({ message: 'This date and time slot has already been booked by another student.' });
    }

    // 2. Prevent duplicate email bookings on the same date/time
    const duplicate = await query.get(
      'SELECT id FROM registrations WHERE booking_date = ? AND (student_email = ? OR parent_email = ?)',
      [bookingDate, studentEmail, parentEmail]
    );
    if (duplicate) {
      return res.status(400).json({ message: 'You have already booked a session on this date. Please cancel your existing booking or select a different date.' });
    }

    // 3. Save booking
    const result = await query.run(`
      INSERT INTO registrations (
        booking_date, booking_time, student_name, parent_name, student_email, parent_email, phone,
        grade, school, city, state, interests, goals, referral, gpa, extracurriculars, target_programs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      bookingDate, bookingTime, studentName, parentName, studentEmail, parentEmail, phone,
      grade, school, city, state, interests, goals, referral, gpa, extracurriculars, targetPrograms
    ]);

    const registrationRecord = {
      id: result.id,
      booking_date: bookingDate,
      booking_time: bookingTime,
      student_name: studentName,
      parent_name: parentName,
      student_email: studentEmail,
      parent_email: parentEmail,
      phone,
      grade,
      school,
      city,
      state,
      interests,
      goals,
      referral,
      gpa,
      extracurriculars,
      target_programs: targetPrograms
    };

    // 4. Send emails in the background
    Promise.resolve().then(async () => {
      try {
        await sendConfirmationEmail(registrationRecord);
        await sendAdminNotification(registrationRecord);
      } catch (err) {
        console.error('Failed to send confirmation emails:', err.message);
      }
    });

    res.status(201).json({
      message: 'Registration successful',
      registrationId: result.id,
      bookingDate,
      bookingTime
    });
  } catch (error) {
    console.error('Booking processing error:', error);
    res.status(500).json({ message: 'Internal server error processing booking' });
  }
});

// 3. Retrieve registrations by email (for self-service unregister portal)
app.post('/api/bookings/my-registrations', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email address is required' });
  }

  try {
    const list = await query.all(
      'SELECT id, booking_date, booking_time, student_name, interests FROM registrations WHERE student_email = ? OR parent_email = ? ORDER BY booking_date ASC',
      [email, email]
    );
    res.json(list);
  } catch (error) {
    console.error('Error fetching student bookings:', error);
    res.status(500).json({ message: 'Database error fetching bookings' });
  }
});

// 4. Unregister (cancel booking)
app.post('/api/bookings/unregister', async (req, res) => {
  const { registrationId } = req.body;
  if (!registrationId) {
    return res.status(400).json({ message: 'Registration ID is required' });
  }

  try {
    const record = await query.get('SELECT * FROM registrations WHERE id = ?', [registrationId]);
    if (!record) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Delete record
    await query.run('DELETE FROM registrations WHERE id = ?', [registrationId]);

    // Send cancellation email in the background
    Promise.resolve().then(async () => {
      try {
        await sendCancellationEmail(record);
      } catch (err) {
        console.error('Failed to send cancellation emails:', err.message);
      }
    });

    res.json({ message: 'Registration cancelled successfully.' });
  } catch (error) {
    console.error('Unregister processing error:', error);
    res.status(500).json({ message: 'Failed to cancel registration' });
  }
});

// 5. Contact Form - forward to admin inbox
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    await sendContactEmail({ name, email, message });
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message. Please email us directly at scholar.nextgens@gmail.com' });
  }
});

// 6. Newsletter Subscription
app.post('/api/newsletter/subscribe', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    const existing = await query.get('SELECT id FROM newsletter WHERE email = ?', [email]);
    if (existing) {
      return res.status(200).json({ message: 'Email already subscribed!' });
    }

    await query.run('INSERT INTO newsletter (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ message: 'Newsletter subscription successful' });
  } catch (error) {
    console.error('Newsletter error:', error);
    res.status(500).json({ message: 'Database error subscribing to newsletter' });
  }
});

// 6. Track Analytics Event
app.post('/api/analytics/track', async (req, res) => {
  const { eventType, url, referrer } = req.body;
  if (!eventType || !url) {
    return res.status(400).json({ message: 'Event type and URL are required' });
  }

  try {
    await query.run('INSERT INTO analytics (event_type, url, referrer) VALUES (?, ?, ?)', [eventType, url, referrer || null]);
    res.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ message: 'Analytics write error' });
  }
});

/* ==========================================================================
   ADMIN AUTHENTICATION & DASHBOARD ENDPOINTS
   ========================================================================== */

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.json({ success: true, token });
  }

  res.status(401).json({ message: 'Invalid admin credentials' });
});

// Admin dashboard statistics & list data
app.get('/api/admin/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const registrations = await query.all('SELECT * FROM registrations ORDER BY id DESC');
    const subscribers = await query.all('SELECT * FROM newsletter ORDER BY id DESC');
    const analytics = await query.all('SELECT * FROM analytics ORDER BY id DESC');

    res.json({
      registrations,
      subscribers,
      analytics
    });
  } catch (error) {
    console.error('Admin dashboard fetch error:', error);
    res.status(500).json({ message: 'Failed to retrieve dashboard details' });
  }
});

// Admin deletes registration (frees slot)
app.delete('/api/admin/registrations/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const record = await query.get('SELECT * FROM registrations WHERE id = ?', [id]);
    if (!record) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await query.run('DELETE FROM registrations WHERE id = ?', [id]);

    // Send cancellation email in background
    Promise.resolve().then(async () => {
      try {
        await sendCancellationEmail(record);
      } catch (err) {
        console.error('Nodemailer background delete failed:', err.message);
      }
    });

    const registrations = await query.all('SELECT * FROM registrations ORDER BY id DESC');
    res.json({ message: 'Registration deleted successfully', registrations });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ message: 'Database error deleting registration' });
  }
});

// Export attendee roster as CSV
app.get('/api/admin/export', authenticateAdmin, async (req, res) => {
  try {
    const list = await query.all(`
      SELECT id, booking_date, booking_time, student_name, student_email, phone,
             parent_name, parent_email, grade, school, city, state, gpa, interests, goals, referral, timestamp
      FROM registrations
      ORDER BY id ASC
    `);

    // Generate CSV content
    const headers = [
      'ID', 'Booking Date', 'Booking Time Slot', 'Student Name', 'Student Email', 'Phone',
      'Parent Name', 'Parent Email', 'Grade', 'School', 'City', 'State', 'GPA', 'Interests', 'Goals', 'Referral Source', 'Signup Timestamp'
    ];

    let csvContent = headers.join(',') + '\n';

    list.forEach((row) => {
      const escapedValues = Object.values(row).map((val) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""'); // Escape inner quotes
        return `"${str}"`;
      });
      csvContent += escapedValues.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="webinar_registrations.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ message: 'Failed to generate CSV download' });
  }
});

// Update admin credentials permanently (writes to .env)
app.post('/api/admin/credentials', authenticateAdmin, (req, res) => {
  const { newEmail, newPassword } = req.body;
  if (!newEmail || !newPassword) {
    return res.status(400).json({ message: 'Both new email and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Replace or insert ADMIN_EMAIL
    if (/^ADMIN_EMAIL=.*/m.test(envContent)) {
      envContent = envContent.replace(/^ADMIN_EMAIL=.*/m, `ADMIN_EMAIL=${newEmail}`);
    } else {
      envContent += `\nADMIN_EMAIL=${newEmail}`;
    }

    // Replace or insert ADMIN_PASSWORD
    if (/^ADMIN_PASSWORD=.*/m.test(envContent)) {
      envContent = envContent.replace(/^ADMIN_PASSWORD=.*/m, `ADMIN_PASSWORD=${newPassword}`);
    } else {
      envContent += `\nADMIN_PASSWORD=${newPassword}`;
    }

    fs.writeFileSync(envPath, envContent, 'utf8');

    // Hot-reload the new values into process.env (takes effect immediately, no restart)
    process.env.ADMIN_EMAIL = newEmail;
    process.env.ADMIN_PASSWORD = newPassword;

    console.log(`Admin credentials updated: ${newEmail}`);
    res.json({ message: 'Credentials updated successfully. Changes are permanent and take effect immediately.' });
  } catch (err) {
    console.error('Failed to update .env:', err);
    res.status(500).json({ message: 'Failed to save credentials to disk. Check server file permissions.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
