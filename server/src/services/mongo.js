const mongoose = require('mongoose');

require('dotenv').config();

const MONGO_URL = "mongodb://localhost:27017/FSD-mini-project";

mongoose.connection.once('open', () => {
  console.log('MongoDB connection has been opened.');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

const mongoConnect = async () => {
  await mongoose.connect(MONGO_URL);
};

const mongoDisconnect = async () => {
  await mongoose.disconnect();
};

module.exports = { mongoConnect, mongoDisconnect };
