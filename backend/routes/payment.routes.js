const router = require('express').Router();
const ctrl = require('../controllers/payment.controller');

router.get('/',                      ctrl.getAll);       // GET    /api/payments
router.get('/pending',               ctrl.getPending);   // GET    /api/payments/pending
router.get('/:id',                   ctrl.getById);      // GET    /api/payments/1
router.get('/lease/:lease_id',       ctrl.getByLease);   // GET    /api/payments/lease/1
router.get('/tenant/:tenant_id',     ctrl.getByTenant);  // GET    /api/payments/tenant/1
router.post('/',                     ctrl.create);       // POST   /api/payments
router.put('/:id/status',            ctrl.updateStatus); // PUT    /api/payments/1/status
router.delete('/:id',                ctrl.remove);       // DELETE /api/payments/1

module.exports = router;