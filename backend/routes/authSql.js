const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { protect } = require('../Middleware/auth');
const router = express.Router();
const tokenFor = user => jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  const { name, email, password, city, role = 'customer' } = req.body;
  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || !password || password.length < 6) return res.status(400).json({ success: false, message: 'Name, valid email and a password of at least six characters are required' });
  if (!['customer', 'worker'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid registration role' });
  try { const hash = await bcrypt.hash(password, 12); const [result] = await pool.query('INSERT INTO users (name,email,password_hash,role,city) VALUES (?,?,?,?,?)', [name.trim(), email.toLowerCase(), hash, role, city || null]); const user = { id: result.insertId, name: name.trim(), email: email.toLowerCase(), role, city: city || null }; res.status(201).json({ success: true, token: tokenFor(user), user }); }
  catch (error) { res.status(error.code === 'ER_DUP_ENTRY' ? 409 : 500).json({ success: false, message: error.code === 'ER_DUP_ENTRY' ? 'Email is already registered' : 'Registration failed' }); }
});

router.post('/login', async (req, res) => {
  try { const [rows] = await pool.query('SELECT id,name,email,password_hash,role,city FROM users WHERE email=?', [(req.body.email || '').toLowerCase()]); const user = rows[0]; if (!user || !(await bcrypt.compare(req.body.password || '', user.password_hash))) return res.status(401).json({ success: false, message: 'Invalid email or password' }); delete user.password_hash; res.json({ success: true, token: tokenFor(user), user }); }
  catch { res.status(500).json({ success: false, message: 'Login failed' }); }
});

router.get('/me', protect, async (req, res) => { try { const [rows] = await pool.query('SELECT id,name,email,role,city,phone,created_at FROM users WHERE id=?', [req.user.id]); if (!rows[0]) return res.status(404).json({ success: false, message: 'User not found' }); res.json({ success: true, user: rows[0] }); } catch { res.status(500).json({ success: false, message: 'Unable to load profile' }); } });
module.exports = router;