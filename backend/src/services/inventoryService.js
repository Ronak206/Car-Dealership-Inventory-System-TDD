const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const createHttpError = require('../utils/httpError');

const purchase = async (vehicleId) => {
  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    throw createHttpError('Invalid vehicle id format', 400);
  }

  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, quantity: { $gte: 1 } },
    { $inc: { quantity: -1 } },
    { new: true }
  );

  if (vehicle) {
    return vehicle;
  }

  const exists = await Vehicle.findById(vehicleId);
  if (!exists) {
    throw createHttpError('Vehicle not found', 404);
  }

  throw createHttpError('Vehicle is out of stock', 400);
};

const restock = async (vehicleId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    throw createHttpError('Invalid vehicle id format', 400);
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    throw createHttpError('Quantity must be a positive number', 400);
  }

  const vehicle = await Vehicle.findByIdAndUpdate(
    vehicleId,
    { $inc: { quantity } },
    { new: true, runValidators: true }
  );

  if (!vehicle) {
    throw createHttpError('Vehicle not found', 404);
  }

  return vehicle;
};

module.exports = { purchase, restock };