const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const verifyToken = require('../middleware/auth');

// Public route - no token needed
router.post('/login', ctrl.login);

// Protected route - token required
router.get('/profile', verifyToken, ctrl.getProfile);

module.exports = router;