const express = require('express');
const { pool } = require('../db');
const router = express.Router();
router.get('/', async (req, res) => { try { const [services] = await pool.query('SELECT id,name,category,description,base_price AS basePrice FROM services WHERE is_active=TRUE ORDER BY name'); res.json({ success: true, services }); } catch { res.status(500).json({ success: false, message: 'Unable to load services' }); } });
router.get('/:id', async (req, res) => { try { const [rows] = await pool.query('SELECT id,name,category,description,base_price AS basePrice FROM services WHERE id=? AND is_active=TRUE', [req.params.id]); if (!rows[0]) return res.status(404).json({ success: false, message: 'Service not found' }); res.json({ success: true, service: rows[0] }); } catch { res.status(500).json({ success: false, message: 'Unable to load service' }); } });
module.exports = router;