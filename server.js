'use strict';

// Load array of notes

console.log('Hello Noteful!');

const express = require('express');
const data = require('./db/notes');
const app = express();

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

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
