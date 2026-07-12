const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const createHttpError = require('../utils/httpError');

const purchase = async (vehicleId) => {
  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    throw createHttpError('Invalid vehicle id format', 400);
  }

  // Atomic: only decrements if quantity is currently >= 1,
  // preventing overselling under concurrent requests.
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, quantity: { $gte: 1 } },
    { $inc: { quantity: -1 } },
    { new: true }
  );

  if (vehicle) {
    return vehicle;
  }

  // Distinguish "doesn't exist" from "exists but out of stock"
  // for accurate 404 vs 400 responses.
  const exists = await Vehicle.findById(vehicleId);
  if (!exists) {
    throw createHttpError('Vehicle not found', 404);
  }

  throw createHttpError('Vehicle is out of stock', 400);
};

const restock = async (vehicleId, quantity) => {
  // TODO: implement in next step
};

module.exports = { purchase, restock };