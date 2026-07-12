const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const inventoryRoutes = require('./routes/inventory');

const app = express();

const allowedOrigins = [
  'https://car-dealership-inventory-system-tdd.vercel.app',
  'http://localhost:5173', // Vite dev server
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vehicles', inventoryRoutes);

module.exports = app;