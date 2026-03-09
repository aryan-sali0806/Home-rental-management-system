const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Home Rental Management API is running...' });
});

// Routes
app.use('/api/owners', require('./routes/owner.routes')); 
app.use('/api/properties', require('./routes/property.routes'));
app.use('/api/tenants',    require('./routes/tenant.routes'));
app.use('/api/leases',       require('./routes/lease.routes'));
app.use('/api/payments',     require('./routes/payment.routes'));
app.use('/api/maintenance',  require('./routes/maintenance.routes'));
app.use('/api/admin',       require('./routes/admin.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});