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

const getAllVehicles = async (filters) => {
  // TODO: implement later in Phase 3
};

const searchVehicles = async (query) => {
  // TODO: implement later in Phase 3
};

const updateVehicle = async (id, updateData) => {
  // TODO: implement later in Phase 3
};

const deleteVehicle = async (id) => {
  // TODO: implement later in Phase 3
};

module.exports = { createVehicle, getAllVehicles, searchVehicles, updateVehicle, deleteVehicle };