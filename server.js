'use strict';

// Load array of notes

console.log('Hello Noteful!');

const express = require('express');
const morgan = require('morgan');
const {PORT} = require('./config');
const router = require('./router/notes.router');
const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());
app.use('/api', router);

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found'});
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
