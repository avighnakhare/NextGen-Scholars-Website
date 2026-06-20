import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_FILE ? path.resolve(__dirname, process.env.DB_FILE) : path.resolve(__dirname, 'database.db');

// Ensure db directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database at:', dbPath);
  }
});

// Promisify database operations
export const query = {
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  exec(sql) {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

// Initialize database schemas
export async function initDb() {
  // We do not need webinars table anymore since we dynamically generate available slots,
  // but we will keep it or drop it. Let's make sure the registrations table has booking_date and booking_time.
  
  await query.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_date TEXT NOT NULL,
      booking_time TEXT NOT NULL,
      student_name TEXT NOT NULL,
      parent_name TEXT NOT NULL,
      student_email TEXT NOT NULL,
      parent_email TEXT NOT NULL,
      phone TEXT NOT NULL,
      grade TEXT NOT NULL,
      school TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      interests TEXT NOT NULL,
      goals TEXT NOT NULL,
      referral TEXT NOT NULL,
      gpa TEXT,
      extracurriculars TEXT,
      target_programs TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query.run(`
    CREATE TABLE IF NOT EXISTS newsletter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query.run(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      url TEXT NOT NULL,
      referrer TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed standard analytics data if empty
  const count = await query.get('SELECT COUNT(*) as count FROM analytics');
  if (count.count === 0) {
    console.log('Seeding mock analytics data...');
    const eventTypes = ['pageview', 'pageview', 'pageview', 'quiz_start', 'quiz_complete', 'registration'];
    for (let i = 0; i < 60; i++) {
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      await query.run(
        'INSERT INTO analytics (event_type, url, referrer, timestamp) VALUES (?, ?, ?, datetime("now", ?))',
        [type, type === 'pageview' ? '/' : '/quiz', 'direct', `-${Math.floor(Math.random() * 5)} days`]
      );
    }

    // Seed a couple of default registrations so the admin panel has mock data
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    await query.run(`
      INSERT INTO registrations (booking_date, booking_time, student_name, parent_name, student_email, parent_email, phone, grade, school, city, state, interests, goals, referral, gpa, extracurriculars, target_programs)
      VALUES (?, '10:00 AM – 10:30 AM', 'Jane Doe', 'John Doe', 'jane.doe@example.com', 'john.doe@example.com', '555-0199', '11th Grade', 'Oakridge High School', 'Charlotte', 'NC', 'STEM, Biology', 'Wants to get into NCSSM & Ivy leagues', 'Search Engine', '3.95', 'Science Olympiad, Track & Field', 'NCSSM, Duke Summer Programs')
    `, [tomorrowStr]);

    await query.run(`
      INSERT INTO registrations (booking_date, booking_time, student_name, parent_name, student_email, parent_email, phone, grade, school, city, state, interests, goals, referral, gpa, extracurriculars, target_programs)
      VALUES (?, '2:30 PM – 3:00 PM', 'Bob Miller', 'Sara Miller', 'bob@example.com', 'sara@example.com', '555-0122', '10th Grade', 'Myers Park High', 'Charlotte', 'NC', 'Robotics, Math', 'Wants to attend NCSSM residential', 'Friend/Family Member', '4.00', 'FTC Robotics, Chess Club', 'NCSSM, Carolina Summer Camps')
    `, [tomorrowStr]);
  }
}

export default db;
