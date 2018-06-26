'use strict';

// Load array of notes

console.log('Hello Noteful!');

const logConsole = require('./middleware/logger');
const {PORT} = require('./config');

const express = require('express');
const data = require('./db/notes');
const simDB = require('./db/simDB');  
const notes = simDB.initialize(data); 
const app = express();

app.use(logConsole);
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  if (searchTerm) {
    let answer = data.filter(el => {
      return el.title.includes(searchTerm);
    });
    res.json(answer);
  } else {
    res.json(data);
  }
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const answer = data.find(el => {
    return el.id === Number(id);
  });
  res.json(answer);
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
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
