const router = require('express').Router();
const ctrl = require('../controllers/lease.controller');

router.get('/',                        ctrl.getAll);          // GET    /api/leases
router.get('/:id',                     ctrl.getById);         // GET    /api/leases/1
router.get('/:id/details',             ctrl.getLeaseDetails); // GET    /api/leases/1/details
router.get('/tenant/:tenant_id',       ctrl.getByTenant);     // GET    /api/leases/tenant/1
router.post('/',                       ctrl.create);          // POST   /api/leases
router.put('/:id/status',              ctrl.updateStatus);    // PUT    /api/leases/1/status
router.delete('/:id',                  ctrl.remove);          // DELETE /api/leases/1

module.exports = router;