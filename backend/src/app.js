const express = require('express');
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const inventoryRoutes = require('./routes/inventory');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vehicles', inventoryRoutes);

module.exports = app;
