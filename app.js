/* global __dirname */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

// set up mongoose connection
const mongoose = require('mongoose');
const mongoDB =
  'mongodb+srv://sudexp:cyvbu9-vowDag-ranqon@online-store-xjg8c.mongodb.net/online-store-db?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// import route
const api = require('./routes/api');

// sample API Routes
app.use('/api/', api);

module.exports = app;
