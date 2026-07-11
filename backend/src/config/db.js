const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    const conn = await mongoose.connect(uri);
    return conn;
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
};

module.exports = { connectDB, disconnectDB };
