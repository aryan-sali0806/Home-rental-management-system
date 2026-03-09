const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// POST /api/admin/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1 - find admin by email
    const [rows] = await db.query(
      'SELECT * FROM Admin WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const admin = rows[0];

    // Step 2 - compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Step 3 - generate JWT token
    const token = jwt.sign(
      { admin_id: admin.admin_id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }  // token expires in 1 day
    );

    res.json({
      message: 'Login successful',
      token: token,
      admin: {
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/admin/profile (protected route - requires token)
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT admin_id, name, email FROM Admin WHERE admin_id = ?',
      [req.admin.admin_id]  // comes from the verified token
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};