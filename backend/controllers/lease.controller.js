const db = require('../config/db');

// GET all leases
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Lease');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single lease by ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Lease WHERE lease_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Lease not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET full lease details with tenant and property info
exports.getLeaseDetails = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        l.lease_id, l.start_date, l.end_date,
        l.deposit_amount, l.lease_status,
        t.tenant_id, t.name AS tenant_name, t.email AS tenant_email, t.phone AS tenant_phone,
        p.property_id, p.title AS property_title, p.location, p.rent_amount
       FROM Lease l
       JOIN Tenant t ON l.tenant_id = t.tenant_id
       JOIN Property p ON l.property_id = p.property_id
       WHERE l.lease_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Lease not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all leases by tenant ID
exports.getByTenant = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        l.lease_id, l.start_date, l.end_date,
        l.deposit_amount, l.lease_status,
        p.title AS property_title, p.location, p.rent_amount
       FROM Lease l
       JOIN Property p ON l.property_id = p.property_id
       WHERE l.tenant_id = ?`,
      [req.params.tenant_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create new lease
exports.create = async (req, res) => {
  try {
    const { tenant_id, property_id, start_date, end_date, deposit_amount, lease_status } = req.body;

    // Create the lease
    const [result] = await db.query(
      'INSERT INTO Lease (tenant_id, property_id, start_date, end_date, deposit_amount, lease_status) VALUES (?, ?, ?, ?, ?, ?)',
      [tenant_id, property_id, start_date, end_date, deposit_amount, lease_status]
    );

    // Mark the property as Rented
    await db.query(
      'UPDATE Property SET status = ? WHERE property_id = ?',
      ['Rented', property_id]
    );

    res.status(201).json({ message: 'Lease created', lease_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update lease status
exports.updateStatus = async (req, res) => {
  try {
    const { lease_status } = req.body;
    await db.query(
      'UPDATE Lease SET lease_status = ? WHERE lease_id = ?',
      [lease_status, req.params.id]
    );

    // If lease is completed or cancelled, mark property as Available
    if (lease_status === 'Completed' || lease_status === 'Cancelled') {
      const [lease] = await db.query(
        'SELECT property_id FROM Lease WHERE lease_id = ?',
        [req.params.id]
      );
      await db.query(
        'UPDATE Property SET status = ? WHERE property_id = ?',
        ['Available', lease[0].property_id]
      );
    }

    res.json({ message: 'Lease status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE lease
exports.remove = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM Lease WHERE lease_id = ?',
      [req.params.id]
    );
    res.json({ message: 'Lease deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    // Auto expire leases whose end_date has passed
    await db.query(`
      UPDATE Lease 
      SET lease_status = 'Completed' 
      WHERE end_date < CURDATE() AND lease_status = 'Active'
    `);

    // Auto update property status
    await db.query(`
      UPDATE Property SET status = 'Available'
      WHERE property_id NOT IN (
        SELECT property_id FROM Lease WHERE lease_status = 'Active'
      )
    `);

    const [rows] = await db.query('SELECT * FROM Lease');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};