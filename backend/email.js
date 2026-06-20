import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.warn('Nodemailer SMTP connection warning:', error.message);
  } else {
    console.log('Nodemailer SMTP server is ready to send messages');
  }
});

/**
 * Sends confirmation email to both Student and Parent
 */
export async function sendConfirmationEmail(registration) {
  const { student_name, parent_name, student_email, parent_email, booking_date, booking_time } = registration;

  const mailOptionsStudent = {
    from: `"NextGen Scholars" <${process.env.GMAIL_USER}>`,
    to: student_email,
    subject: 'Webinar Registration Confirmed',
    text: `Hello ${student_name},

Your registration has been successfully confirmed.

Date: ${booking_date}
Time: ${booking_time}

You will receive your Zoom link prior to the webinar.

We look forward to meeting you.

Best regards,
NextGen Scholars`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #d97706; padding-bottom: 10px;">Webinar Registration Confirmed</h2>
        <p>Hello <strong>${student_name}</strong>,</p>
        <p>Your registration has been successfully confirmed.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${booking_date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${booking_time}</p>
        </div>
        <p>You will receive your Zoom link prior to the webinar.</p>
        <p>We look forward to meeting you.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 0.875rem; color: #64748b;">NextGen Scholars &bull; <a href="mailto:scholar.nextgens@gmail.com" style="color: #d97706; text-decoration: none;">scholar.nextgens@gmail.com</a></p>
      </div>
    `
  };

  const mailOptionsParent = {
    from: `"NextGen Scholars" <${process.env.GMAIL_USER}>`,
    to: parent_email,
    subject: `Webinar Registration Confirmed - Student: ${student_name}`,
    text: `Hello ${parent_name},

Your student, ${student_name}, has successfully registered for the NextGen Scholars Admissions Assessment Webinar.

Date: ${booking_date}
Time: ${booking_time}

They will receive the Zoom link prior to the webinar. We welcome you to join them for this informative session!

Best regards,
NextGen Scholars`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #d97706; padding-bottom: 10px;">Webinar Registration Confirmed</h2>
        <p>Hello <strong>${parent_name}</strong>,</p>
        <p>Your student, <strong>${student_name}</strong>, has successfully registered for the NextGen Scholars Admissions Assessment Webinar.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${booking_date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${booking_time}</p>
        </div>
        <p>They will receive the Zoom link prior to the webinar. We welcome you to join them for this informative session!</p>
        <p>We look forward to meeting your family.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 0.875rem; color: #64748b;">NextGen Scholars &bull; <a href="mailto:scholar.nextgens@gmail.com" style="color: #d97706; text-decoration: none;">scholar.nextgens@gmail.com</a></p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptionsStudent);
    if (parent_email && parent_email.toLowerCase() !== student_email.toLowerCase()) {
      await transporter.sendMail(mailOptionsParent);
    }
    console.log(`Confirmation emails sent for student ${student_name}`);
  } catch (error) {
    console.error('Error sending confirmation emails:', error.message);
  }
}

/**
 * Sends admin notification email
 */
export async function sendAdminNotification(registration) {
  const {
    student_name, parent_name, student_email, parent_email, phone, grade,
    school, city, state, interests, goals, referral, gpa, extracurriculars, target_programs, booking_date, booking_time
  } = registration;

  const mailOptions = {
    from: `"NextGen Scholars System" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || 'scholar.nextgens@gmail.com',
    subject: `New Webinar Registration - ${student_name}`,
    text: `New Webinar Registration received!

STUDENT PROFILE:
- Name: ${student_name}
- Email: ${student_email}
- Phone: ${phone}
- Grade: ${grade}
- School: ${school}
- Location: ${city}, ${state}
- Academic Interests: ${interests}
- Goals: ${goals}
- GPA: ${gpa || 'N/A'}
- Extracurriculars: ${extracurriculars || 'N/A'}
- Target Programs: ${target_programs || 'N/A'}
- Referral: ${referral}

PARENT INFORMATION:
- Parent Name: ${parent_name}
- Parent Email: ${parent_email}

SELECTED TIME SLOT:
- Date: ${booking_date}
- Time: ${booking_time}

Timestamp: ${new Date().toLocaleString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #d97706; padding-bottom: 10px; margin-top: 0;">New Webinar Registration</h2>
        
        <h3 style="color: #0f172a; margin-bottom: 10px;">Selected Session</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 120px;">Date/Time:</td>
            <td style="padding: 6px 0;">${booking_date} @ ${booking_time}</td>
          </tr>
        </table>

        <h3 style="color: #0f172a; margin-bottom: 10px;">Student Profile</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 120px; border-bottom: 1px solid #f1f5f9;">Name:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${student_name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Email:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${student_email}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Phone:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Grade:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${grade}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">School:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${school}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Location:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${city}, ${state}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">GPA:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${gpa || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Interests:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${interests}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Extracurriculars:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${extracurriculars || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Target Programs:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${target_programs || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Goals:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${goals}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Referral:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${referral}</td>
          </tr>
        </table>

        <h3 style="color: #0f172a; margin-bottom: 10px;">Parent Profile</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 120px; border-bottom: 1px solid #f1f5f9;">Parent Name:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${parent_name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Parent Email:</td>
            <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${parent_email}</td>
          </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 0.875rem; color: #64748b; margin: 0;">System notification timestamp: ${new Date().toLocaleString()}</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin email alert sent for student ${student_name}`);
  } catch (error) {
    console.error('Error sending admin alert:', error.message);
  }
}

/**
 * Sends cancellation confirmation email
 */
export async function sendCancellationEmail(registration) {
  const { student_name, parent_name, student_email, parent_email, booking_date, booking_time } = registration;

  const mailOptionsStudent = {
    from: `"NextGen Scholars" <${process.env.GMAIL_USER}>`,
    to: student_email,
    subject: 'Webinar Registration Cancelled',
    text: `Hello ${student_name},

Your registration for the NextGen Scholars Admissions Assessment Webinar on ${booking_date} at ${booking_time} has been successfully cancelled.

If this was a mistake, you can schedule a new session at any time on our platform.

Best regards,
NextGen Scholars`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #b91c1c; border-bottom: 2px solid #b91c1c; padding-bottom: 10px;">Registration Cancelled</h2>
        <p>Hello <strong>${student_name}</strong>,</p>
        <p>Your registration for the NextGen Scholars Admissions Assessment Webinar has been successfully cancelled.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${booking_date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${booking_time}</p>
        </div>
        <p>If this was an error, please visit our scheduling page to book another available slot.</p>
        <p>We hope to see you in the future.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 0.875rem; color: #64748b;">NextGen Scholars &bull; <a href="mailto:scholar.nextgens@gmail.com" style="color: #d97706; text-decoration: none;">scholar.nextgens@gmail.com</a></p>
      </div>
    `
  };

  const mailOptionsParent = {
    from: `"NextGen Scholars" <${process.env.GMAIL_USER}>`,
    to: parent_email,
    subject: `Webinar Registration Cancelled - Student: ${student_name}`,
    text: `Hello ${parent_name},

The registration for your student, ${student_name}, for the NextGen Scholars Admissions Assessment Webinar on ${booking_date} at ${booking_time} has been successfully cancelled.

Best regards,
NextGen Scholars`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #b91c1c; border-bottom: 2px solid #b91c1c; padding-bottom: 10px;">Registration Cancelled</h2>
        <p>Hello <strong>${parent_name}</strong>,</p>
        <p>The registration for your student, <strong>${student_name}</strong>, for the NextGen Scholars Admissions Assessment Webinar has been successfully cancelled.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Cancelled Date:</strong> ${booking_date}</p>
          <p style="margin: 5px 0;"><strong>Cancelled Time:</strong> ${booking_time}</p>
        </div>
        <p>Best regards,</p>
        <p>NextGen Scholars</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 0.875rem; color: #64748b;">NextGen Scholars &bull; <a href="mailto:scholar.nextgens@gmail.com" style="color: #d97706; text-decoration: none;">scholar.nextgens@gmail.com</a></p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptionsStudent);
    if (parent_email && parent_email.toLowerCase() !== student_email.toLowerCase()) {
      await transporter.sendMail(mailOptionsParent);
    }
    console.log(`Cancellation confirmation emails sent for student ${student_name}`);
  } catch (error) {
    console.error('Error sending cancellation emails:', error.message);
  }
}

/**
 * Forwards a contact form message to the admin inbox
 */
export async function sendContactEmail({ name, email, message }) {
  const mailOptions = {
    from: `"NextGen Scholars Website" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || 'scholar.nextgens@gmail.com',
    replyTo: email,
    subject: `New Contact Form Message from ${name}`,
    text: `You have a new contact form submission.\n\nFrom: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nTimestamp: ${new Date().toLocaleString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #d97706; padding-bottom: 10px; margin-top: 0;">📩 New Contact Form Message</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 100px; border-bottom: 1px solid #f1f5f9;">Name:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Email:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}" style="color: #d97706;">${email}</a></td>
          </tr>
        </table>
        <h3 style="color: #0f172a; margin-bottom: 8px;">Message:</h3>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px; white-space: pre-wrap; line-height: 1.6;">${message}</div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 0.875rem; color: #64748b; margin: 0;">Sent via NextGen Scholars contact form &bull; ${new Date().toLocaleString()}</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact form message forwarded from ${name} (${email})`);
  } catch (error) {
    console.error('Error sending contact email:', error.message);
    throw error;
  }
}
