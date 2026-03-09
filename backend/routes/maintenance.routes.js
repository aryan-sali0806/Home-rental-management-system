const router = require('express').Router();
const ctrl = require('../controllers/maintenance.controller');

router.get('/',                        ctrl.getAll);         // GET    /api/maintenance
router.get('/status/:status',          ctrl.getByStatus);    // GET    /api/maintenance/status/Open
router.get('/:id',                     ctrl.getById);        // GET    /api/maintenance/1
router.get('/tenant/:tenant_id',       ctrl.getByTenant);    // GET    /api/maintenance/tenant/1
router.get('/property/:property_id',   ctrl.getByProperty);  // GET    /api/maintenance/property/1
router.post('/',                       ctrl.create);         // POST   /api/maintenance
router.put('/:id/status',              ctrl.updateStatus);   // PUT    /api/maintenance/1/status
router.delete('/:id',                  ctrl.remove);         // DELETE /api/maintenance/1

module.exports = router;