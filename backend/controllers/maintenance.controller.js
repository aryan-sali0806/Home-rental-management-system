const db = require('../config/db');

// GET all maintenance requests
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        m.request_id, m.description, m.request_date, m.status,
        t.name AS tenant_name, t.phone AS tenant_phone,
        p.title AS property_title, p.location
       FROM MaintenanceRequest m
       JOIN Tenant t ON m.tenant_id = t.tenant_id
       JOIN Property p ON m.property_id = p.property_id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single request by ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        m.request_id, m.description, m.request_date, m.status,
        t.name AS tenant_name, t.phone AS tenant_phone,
        p.title AS property_title, p.location
       FROM MaintenanceRequest m
       JOIN Tenant t ON m.tenant_id = t.tenant_id
       JOIN Property p ON m.property_id = p.property_id
       WHERE m.request_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all requests by tenant ID
exports.getByTenant = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        m.request_id, m.description, m.request_date, m.status,
        p.title AS property_title, p.location
       FROM MaintenanceRequest m
       JOIN Property p ON m.property_id = p.property_id
       WHERE m.tenant_id = ?`,
      [req.params.tenant_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all requests by property ID
exports.getByProperty = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        m.request_id, m.description, m.request_date, m.status,
        t.name AS tenant_name, t.phone AS tenant_phone
       FROM MaintenanceRequest m
       JOIN Tenant t ON m.tenant_id = t.tenant_id
       WHERE m.property_id = ?`,
      [req.params.property_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET requests by status (Open / In Progress / Resolved)
exports.getByStatus = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        m.request_id, m.description, m.request_date, m.status,
        t.name AS tenant_name, t.phone AS tenant_phone,
        p.title AS property_title, p.location
       FROM MaintenanceRequest m
       JOIN Tenant t ON m.tenant_id = t.tenant_id
       JOIN Property p ON m.property_id = p.property_id
       WHERE m.status = ?`,
      [req.params.status]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create new maintenance request
exports.create = async (req, res) => {
  try {
    const { tenant_id, property_id, description, request_date } = req.body;
    const [result] = await db.query(
      `INSERT INTO MaintenanceRequest 
       (tenant_id, property_id, description, request_date, status) 
       VALUES (?, ?, ?, ?, 'Open')`,
      [tenant_id, property_id, description, request_date]
    );
    res.status(201).json({ message: 'Maintenance request created', request_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update request status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db.query(
      'UPDATE MaintenanceRequest SET status = ? WHERE request_id = ?',
      [status, req.params.id]
    );
    res.json({ message: 'Maintenance request status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE request
exports.remove = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM MaintenanceRequest WHERE request_id = ?',
      [req.params.id]
    );
    res.json({ message: 'Maintenance request deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};