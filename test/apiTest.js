/* global process */
/* global before */
/* global it */
/* global describe */
var express = require('express');
var app = express();
var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var pg = require('pg');
var config = require('../config.js');
var server = require('../server.js');

server.start();

describe('API', function() {
  var url = 'http://localhost:3000';
  
  describe('Get User', function() {

    it('should return correct user, in JSON, when given proper id and credentials', function(done) {
      var testUser = config.test.user;
      var requestObj = {
        username: testUser.username,
        password: config.test.password
      };
      
      request(url).get('/api/users/' + testUser.username).send(requestObj).expect('Content-Type', /json/).end(function(err, res) {
        assert.deepEqual(res.body, testUser, 'Returned User should equal testUser');
        done(err);
      });
    });
    
    it('should return a 401 when the wrong username and password is sent', function(done) {
      var requestObj = {
        username: config.test.user.username,
        password: config.test.password + 'bad'
      };
      
      request(url).get('/api/users/' + config.test.user.username).send(requestObj).end(function(err, res) {
        assert.equal(res.status, 401, 'Response status should be 401');
        assert.equal(res.statusCode, 401, 'Response status should be 401');
        done(err);
      });
    });
  });
  
  describe('Get Spending', function() {
    
    it('should return correct spending, in JSON, when given proper id and credentials', function(done) {
      var requestObj = {
        username: config.test.user.username,
        password: config.test.password
      };
     var spending = config.test.user.spending;
     var total = config.test.user.total;
     
     request(url).get('/api/spending/' + config.test.user.username).send(requestObj).expect('Content-Type', /json/).end(function(err, res) {
       assert.deepEqual(res.body.spending, spending, 'Response spending should match test user spending');
       assert.equal(res.body.total, total, 'Response total should match test user total');
       done(err);
     });
    });
    
    it('should return a 401 when the wrong username and password is sent', function(done) {
      var requestObj = {
        username: config.test.user.username,
        password: config.test.password + 'bad'
      };
      
      request(url).get('/api/spending/' + config.test.user.username).send(requestObj).end(function(err, res) {
        assert.equal(res.status, 401, 'Response status should be 401');
        assert.equal(res.statusCode, 401, 'Response status should be 401');
        done(err);
      });
    });
    
    it('should return correct spending, in JSON, when given proper username, password, and filter dates', function(done) {
     var testUser = config.test.user;
     var requestObj = {
       username: testUser.username,
       password: config.test.password,
       from: config.test.filterDates.from,
       to: config.test.filterDates.to
     };
     var spending = config.test.filterSpending;
     var total = config.test.filteredTotal;
     
     request(url).get('/api/spending/' + config.test.user.username).send(requestObj).expect('Content-Type', /json/).end(function(err, res) {
       assert.deepEqual(res.body.spending, spending, 'Response spending should match test user spending');
       assert.equal(res.body.total, total, 'Response total should match test user total');
       done(err);
     });
    });
    
  });
  
});

