const mongoose = require('mongoose');

const DB_PASSWORD = process.env.DB_PASSWORD;

const DB = process.env.MONGO_URI.replace('<password>', DB_PASSWORD);

const connectDb = async () => {
  try {
    await mongoose.connect(DB);
    console.log(`connected to MongoDb...`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
