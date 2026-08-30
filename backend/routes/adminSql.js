const express = require('express');
const { pool } = require('../db');
const { protect, authorize } = require('../Middleware/auth');
const router = express.Router();
router.get('/dashboard', protect, authorize('admin'), async (req, res) => { try { const [[users]] = await pool.query('SELECT COUNT(*) AS count FROM users'); const [[workers]] = await pool.query('SELECT COUNT(*) AS count FROM worker_profiles'); const [[bookings]] = await pool.query('SELECT COUNT(*) AS count FROM bookings'); res.json({ success: true, stats: { users: users.count, workers: workers.count, bookings: bookings.count } }); } catch { res.status(500).json({ success: false, message: 'Unable to load dashboard' }); } });
module.exports = router;