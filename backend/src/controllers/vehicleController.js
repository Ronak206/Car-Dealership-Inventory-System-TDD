const vehicleService = require('../services/vehicleService');

const createVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json({ vehicle });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json({ vehicles });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
  }
};

const searchVehicles = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

const updateVehicle = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

const deleteVehicle = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

module.exports = { createVehicle, getAllVehicles, searchVehicles, updateVehicle, deleteVehicle };