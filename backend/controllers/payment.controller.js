const db = require('../config/db');

// GET all payments
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Payment');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single payment by ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Payment WHERE payment_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all payments by lease ID
exports.getByLease = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        p.payment_id, p.amount, p.payment_date,
        p.payment_method, p.payment_status,
        t.name AS tenant_name,
        pr.title AS property_title
       FROM Payment p
       JOIN Lease l ON p.lease_id = l.lease_id
       JOIN Tenant t ON l.tenant_id = t.tenant_id
       JOIN Property pr ON l.property_id = pr.property_id
       WHERE p.lease_id = ?`,
      [req.params.lease_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all payments by tenant ID
exports.getByTenant = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        p.payment_id, p.amount, p.payment_date,
        p.payment_method, p.payment_status,
        pr.title AS property_title, pr.location
       FROM Payment p
       JOIN Lease l ON p.lease_id = l.lease_id
       JOIN Property pr ON l.property_id = pr.property_id
       WHERE l.tenant_id = ?`,
      [req.params.tenant_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all pending payments
exports.getPending = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        p.payment_id, p.amount, p.payment_date,
        p.payment_method, p.payment_status,
        t.name AS tenant_name, t.phone AS tenant_phone,
        pr.title AS property_title
       FROM Payment p
       JOIN Lease l ON p.lease_id = l.lease_id
       JOIN Tenant t ON l.tenant_id = t.tenant_id
       JOIN Property pr ON l.property_id = pr.property_id
       WHERE p.payment_status = 'Pending'`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create new payment
exports.create = async (req, res) => {
  try {
    const { lease_id, amount, payment_date, payment_method, payment_status } = req.body;
    const [result] = await db.query(
      'INSERT INTO Payment (lease_id, amount, payment_date, payment_method, payment_status) VALUES (?, ?, ?, ?, ?)',
      [lease_id, amount, payment_date, payment_method, payment_status]
    );
    res.status(201).json({ message: 'Payment created', payment_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update payment status (Pending → Paid)
exports.updateStatus = async (req, res) => {
  try {
    const { payment_status } = req.body;
    await db.query(
      'UPDATE Payment SET payment_status = ? WHERE payment_id = ?',
      [payment_status, req.params.id]
    );
    res.json({ message: 'Payment status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE payment
exports.remove = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM Payment WHERE payment_id = ?',
      [req.params.id]
    );
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};