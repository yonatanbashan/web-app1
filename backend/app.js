const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

// Instantiate express app
const app = express();

const mongoDbClusterUser = 'admin';
const mongoDbClusterPass = 'wExyX8RQQaJSwn03';
const dbName = 'blogs-db';

const connectAddress = 'mongodb+srv://' + mongoDbClusterUser + ':' + mongoDbClusterPass + '@cluster0-saxps.mongodb.net/' + dbName + '?retryWrites=true';

mongoose.connect(connectAddress)
  .then(() => {
    console.log('Connected to DB!');
  })
  .catch(() => {
    console.log('Failed to connect to DB!');
  });


// Add body parser for JSON requests. Adds 'body' field for req parameters.
app.use(bodyParser.json());

// Access control: to avoid CORS errors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With-Header, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, DELETE, PATCH, OPTIONS'
  );
  next();
});



app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

// This is the 'valid' way to export the express app
module.exports = app;
