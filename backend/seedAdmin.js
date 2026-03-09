const bcrypt = require('bcryptjs');
const db = require('./config/db');

const seedAdmin = async () => {
  const password = 'admin123';
  const hashed = await bcrypt.hash(password, 10);

  await db.query(
    'UPDATE Admin SET password = ? WHERE email = ?',
    [hashed, 'admin@rental.com']
  );

  console.log('✅ Admin password updated successfully');
  console.log('Email    → admin@rental.com');
  console.log('Password → admin123');
  process.exit();
};

seedAdmin();