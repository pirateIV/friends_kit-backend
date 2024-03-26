const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const connectDb = require('./config/db');
const usersRouter = require('./routes/usersRouter');
const loginRouter = require('./routes/loginRouter');

mongoose.set('strictQuery', false);
connectDb();

app.get('/', (req, res) => {
  res.send('Express app init...');
});

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
