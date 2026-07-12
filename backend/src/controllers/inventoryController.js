const inventoryService = require('../services/inventoryService');

const purchase = async (req, res) => {
  try {
    const vehicle = await inventoryService.purchase(req.params.id);
    res.status(200).json({ vehicle });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
};

const restock = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

module.exports = { purchase, restock };