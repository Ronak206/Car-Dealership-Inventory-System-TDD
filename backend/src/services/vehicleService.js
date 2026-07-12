const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const createHttpError = require('../utils/httpError');

const createVehicle = async (vehicleData) => {
  const { make, model, category, price, quantity } = vehicleData;

  if (!make || !model || !category || price === undefined || quantity === undefined) {
    throw createHttpError('make, model, category, price, and quantity are required', 400);
  }

  const vehicle = await Vehicle.create({ make, model, category, price, quantity });
  return vehicle;
};

const getAllVehicles = async () => {
  const vehicles = await Vehicle.find();
  return vehicles;
};

const searchVehicles = async (query) => {
  const { make, model, category, minPrice, maxPrice } = query;
  const filter = {};

  if (make) filter.make = make;
  if (model) filter.model = model;
  if (category) filter.category = category;

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  const vehicles = await Vehicle.find(filter);
  return vehicles;
};

const updateVehicle = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError('Invalid vehicle id format', 400);
  }

  const vehicle = await Vehicle.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!vehicle) {
    throw createHttpError('Vehicle not found', 404);
  }

  return vehicle;
};

const deleteVehicle = async (id) => {
  // TODO: implement later in Phase 3
};

module.exports = { createVehicle, getAllVehicles, searchVehicles, updateVehicle, deleteVehicle };