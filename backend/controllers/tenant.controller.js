const db = require('../config/db');

// GET all tenants
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Tenant');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single tenant by ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Tenant WHERE tenant_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET tenant along with their active lease and property details
exports.getTenantWithLease = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        t.tenant_id, t.name, t.email, t.phone, t.occupation,
        l.lease_id, l.start_date, l.end_date, l.lease_status,
        p.title, p.location, p.rent_amount
       FROM Tenant t
       LEFT JOIN Lease l ON t.tenant_id = l.tenant_id
       LEFT JOIN Property p ON l.property_id = p.property_id
       WHERE t.tenant_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create new tenant
exports.create = async (req, res) => {
  try {
    const { name, email, phone, id_proof, occupation } = req.body;
    const [result] = await db.query(
      'INSERT INTO Tenant (name, email, phone, id_proof, occupation) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, id_proof, occupation]
    );
    res.status(201).json({ message: 'Tenant created', tenant_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update tenant
exports.update = async (req, res) => {
  try {
    const { name, email, phone, id_proof, occupation } = req.body;
    await db.query(
      'UPDATE Tenant SET name=?, email=?, phone=?, id_proof=?, occupation=? WHERE tenant_id=?',
      [name, email, phone, id_proof, occupation, req.params.id]
    );
    res.json({ message: 'Tenant updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE tenant
exports.remove = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM Tenant WHERE tenant_id = ?',
      [req.params.id]
    );
    res.json({ message: 'Tenant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};