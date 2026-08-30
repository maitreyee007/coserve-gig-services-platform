const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const config = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
};
const database = process.env.MYSQL_DATABASE || 'coserve';
const pool = mysql.createPool({ ...config, database,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
});

async function initializeDatabase() {
  const bootstrap = await mysql.createConnection(config);
  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  await bootstrap.end();
  const connection = await pool.getConnection();
  try {
    await connection.query(`CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL,
      role ENUM('customer','worker','cooperative','admin') NOT NULL DEFAULT 'customer',
      city VARCHAR(100), phone VARCHAR(30), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await connection.query(`CREATE TABLE IF NOT EXISTS cooperatives (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(180) NOT NULL,
      city VARCHAR(100) NOT NULL, speciality VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await connection.query(`CREATE TABLE IF NOT EXISTS services (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL UNIQUE,
      category VARCHAR(80) NOT NULL, description TEXT, base_price DECIMAL(10,2) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await connection.query(`CREATE TABLE IF NOT EXISTS worker_profiles (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED NOT NULL UNIQUE,
      cooperative_id INT UNSIGNED, skills JSON NOT NULL, experience_years INT NOT NULL DEFAULT 0,
      hourly_rate DECIMAL(10,2) NOT NULL, rating DECIMAL(3,2) NOT NULL DEFAULT 0,
      completed_jobs INT NOT NULL DEFAULT 0, location VARCHAR(160), available_now BOOLEAN NOT NULL DEFAULT TRUE,
      verified BOOLEAN NOT NULL DEFAULT FALSE, emergency_available BOOLEAN NOT NULL DEFAULT FALSE,
      FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (cooperative_id) REFERENCES cooperatives(id)
    )`);
    await connection.query(`CREATE TABLE IF NOT EXISTS bookings (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, booking_code VARCHAR(20) NOT NULL UNIQUE,
      customer_id INT UNSIGNED NOT NULL, worker_id INT UNSIGNED NOT NULL, service_id INT UNSIGNED NOT NULL,
      booking_date DATETIME NOT NULL, address VARCHAR(255) NOT NULL, description TEXT,
      amount DECIMAL(10,2) NOT NULL, status ENUM('PENDING','ACCEPTED','ON_THE_WAY','ARRIVED','IN_PROGRESS','COMPLETED','REJECTED','CANCELLED','DISPUTED') NOT NULL DEFAULT 'PENDING',
      arrival_otp_hash VARCHAR(255), completion_otp_hash VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES users(id), FOREIGN KEY (worker_id) REFERENCES users(id), FOREIGN KEY (service_id) REFERENCES services(id),
      INDEX booking_customer (customer_id), INDEX booking_worker (worker_id)
    )`);
    await connection.query(`CREATE TABLE IF NOT EXISTS reviews (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, booking_id INT UNSIGNED NOT NULL UNIQUE,
      customer_id INT UNSIGNED NOT NULL, worker_id INT UNSIGNED NOT NULL, rating TINYINT NOT NULL,
      review TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id), FOREIGN KEY (customer_id) REFERENCES users(id), FOREIGN KEY (worker_id) REFERENCES users(id)
    )`);
    const passwordHash = await bcrypt.hash('demo123', 12);
    await connection.query('INSERT IGNORE INTO users (id,name,email,password_hash,role,city) VALUES ?', [[
      [1, 'Priya Sharma', 'priya@demo.coserve.in', passwordHash, 'customer', 'Chennai'],
      [2, 'Ravi Kumar', 'ravi@demo.coserve.in', passwordHash, 'worker', 'Chennai'],
      [3, 'Meenakshi Sundaram', 'meenakshi@demo.coserve.in', passwordHash, 'cooperative', 'Chennai'],
      [4, 'Admin User', 'admin@coserve.in', passwordHash, 'admin', 'Chennai'],
    ]]);
    await connection.query('INSERT IGNORE INTO cooperatives (id,name,city,speciality) VALUES ?', [[
      [1, 'Anna Nagar Electrical Workers Cooperative', 'Chennai', 'Electrical'],
      [2, 'T. Nagar Plumbing Guild Cooperative', 'Chennai', 'Plumbing'],
    ]]);
    await connection.query('INSERT IGNORE INTO services (id,name,category,description,base_price) VALUES ?', [[
      [1, 'Electrical Repair', 'Electrical', 'Wiring, switches, fan installation and fuse boxes', 350],
      [2, 'Plumbing', 'Plumbing', 'Leak repair, pipe fitting and drainage cleaning', 400],
      [3, 'House Cleaning', 'Cleaning', 'Deep cleaning, mopping and sanitization', 250],
      [4, 'Carpentry', 'Carpentry', 'Furniture repair and door/window fixing', 500],
      [5, 'Painting', 'Painting', 'Interior and exterior wall painting', 600],
      [6, 'Appliance Repair', 'Appliance', 'AC, washing machine and refrigerator repair', 450],
      [7, 'Gardening', 'Gardening', 'Garden maintenance and lawn mowing', 300],
      [8, 'Security Systems', 'Security', 'CCTV and alarm installation', 800],
    ]]);
    await connection.query('INSERT IGNORE INTO worker_profiles (user_id,cooperative_id,skills,experience_years,hourly_rate,rating,completed_jobs,location,available_now,verified,emergency_available) VALUES ?', [[
      [2, 1, JSON.stringify(['House Wiring', 'Fan Installation', 'Switch Repair', 'MCB Fitting']), 5, 350, 4.9, 124, 'Anna Nagar, Chennai', true, true, true],
    ]]);
  } finally { connection.release(); }
}

module.exports = { pool, initializeDatabase };