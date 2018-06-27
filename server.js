'use strict';

// Load array of notes

console.log('Hello Noteful!');

const express = require('express');
const morgan = require('morgan');

const data = require('./db/notes');
const simDB = require('./db/simDB');  
const notes = simDB.initialize(data); 

// const logConsole = require('./middleware/logger');
const {PORT} = require('./config');

const app = express();

app.use(morgan('common'));
// app.use(logConsole);

app.use(express.static('public'));

app.use(express.json());

app.get('/api/notes', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); 
    }
    res.json(list);
  });
});

app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});


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
