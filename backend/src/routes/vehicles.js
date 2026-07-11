const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { createVehicle, getAllVehicles, searchVehicles, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');

router.post('/', verifyToken, createVehicle);
router.get('/search', verifyToken, searchVehicles);
router.get('/', verifyToken, getAllVehicles);
router.put('/:id', verifyToken, updateVehicle);
router.delete('/:id', verifyToken, requireAdmin, deleteVehicle);

module.exports = router;
