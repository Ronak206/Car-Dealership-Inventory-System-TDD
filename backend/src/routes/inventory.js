const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { purchase, restock } = require('../controllers/inventoryController');

router.post('/:id/purchase', verifyToken, purchase);
router.post('/:id/restock', verifyToken, requireAdmin, restock);

module.exports = router;
