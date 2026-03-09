const router = require('express').Router();
const ctrl = require('../controllers/owner.controller');

router.get('/',     ctrl.getAll);     // GET    /api/owners
router.get('/:id',  ctrl.getById);    // GET    /api/owners/1
router.post('/',    ctrl.create);     // POST   /api/owners
router.put('/:id',  ctrl.update);     // PUT    /api/owners/1
router.delete('/:id', ctrl.remove);  // DELETE /api/owners/1

module.exports = router;