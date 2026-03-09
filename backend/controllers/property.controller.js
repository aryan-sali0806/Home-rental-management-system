const db = require('../config/db');

// GET all properties
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Property');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single property by ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Property WHERE property_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET properties by status (Available / Rented)
exports.getByStatus = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Property WHERE status = ?',
      [req.params.status]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create new property
exports.create = async (req, res) => {
  try {
    const { owner_id, title, location, rent_amount, status, description } = req.body;
    const [result] = await db.query(
      'INSERT INTO Property (owner_id, title, location, rent_amount, status, description) VALUES (?, ?, ?, ?, ?, ?)',
      [owner_id, title, location, rent_amount, status, description]
    );
    res.status(201).json({ message: 'Property created', property_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update property
exports.update = async (req, res) => {
  try {
    const { title, location, rent_amount, status, description } = req.body;
    await db.query(
      'UPDATE Property SET title=?, location=?, rent_amount=?, status=?, description=? WHERE property_id=?',
      [title, location, rent_amount, status, description, req.params.id]
    );
    res.json({ message: 'Property updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE property
exports.remove = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM Property WHERE property_id = ?',
      [req.params.id]
    );
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

