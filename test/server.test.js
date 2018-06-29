'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('GET /api/notes', function() {
  it ('should return the default of 10 Notes as an array', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
      });
  });
  it ('should return a list with the correct right fields', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys('id', 'title', 'content');
        });
      });
  });
  it ('should return correct search results for a valid query', function() {
    return chai.request(app)
      .get('/api/notes?searchTerm=about%20cats')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(4);
        expect(res.body[0]).to.be.an('object');
      });
  });
  it ('should return an empty array for an incorrect array', function() {
    return chai.request(app)
      .get('/api/notes?searchTerm=Not%20a%20Valid%20Search')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(0);
      });
  });
});

describe('GET /api/notes/:id', function () {

  it('should return correct notes', function () {
    return chai.request(app)
      .get('/api/notes/1000')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1000);
      });
  });

  it('should respond with a 404 for an invalid id', function () {
    return chai.request(app)
      .get('/api/notes/DOESNOTEXIST')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});