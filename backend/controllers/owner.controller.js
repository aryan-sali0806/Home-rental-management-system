const db = require('../config/db');

// GET all owners
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Owner');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single owner by ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Owner WHERE owner_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create new owner
exports.create = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const [result] = await db.query(
      'INSERT INTO Owner (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email, phone, address]
    );
    res.status(201).json({ message: 'Owner created', owner_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update owner
exports.update = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    await db.query(
      'UPDATE Owner SET name=?, email=?, phone=?, address=? WHERE owner_id=?',
      [name, email, phone, address, req.params.id]
    );
    res.json({ message: 'Owner updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE owner
exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM Owner WHERE owner_id = ?', [req.params.id]);
    res.json({ message: 'Owner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};