const router = require('express').Router();
const ctrl = require('../controllers/tenant.controller');

router.get('/',           ctrl.getAll);             // GET    /api/tenants
router.get('/:id',        ctrl.getById);            // GET    /api/tenants/1
router.get('/:id/lease',  ctrl.getTenantWithLease); // GET    /api/tenants/1/lease
router.post('/',          ctrl.create);             // POST   /api/tenants
router.put('/:id',        ctrl.update);             // PUT    /api/tenants/1
router.delete('/:id',     ctrl.remove);             // DELETE /api/tenants/1

module.exports = router;