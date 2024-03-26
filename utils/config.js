require('dotenv').config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const DB_PASSWORD = process.env.DB_PASSWORD;

module.exports = { PORT, MONGO_URI, DB_PASSWORD };
 