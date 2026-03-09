const router = require('express').Router();
const ctrl = require('../controllers/property.controller');

router.get('/',                  ctrl.getAll);      // GET    /api/properties
router.get('/:id',               ctrl.getById);     // GET    /api/properties/1
router.get('/status/:status',    ctrl.getByStatus); // GET    /api/properties/status/Available
router.post('/',                 ctrl.create);      // POST   /api/properties
router.put('/:id',               ctrl.update);      // PUT    /api/properties/1
router.delete('/:id',            ctrl.remove);      // DELETE /api/properties/1

module.exports = router;