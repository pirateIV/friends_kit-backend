const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const usersRouter = require('./routes/usersRouter');

app.use('/api/users', usersRouter);

module.exports = app;
