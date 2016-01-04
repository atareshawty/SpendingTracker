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
        password: testUser.password
      };
      delete testUser.filterDates;
      delete testUser.password;
      
      request(url).get('/api/users/' + testUser.id).send(requestObj).expect('Content-Type', /json/).end(function(err, res) {
        assert.deepEqual(res.body, testUser, 'Returned User should equal testUser');
        done(err);
      });
    });
    
    it('should return a 401 when the wrong username and password is sent', function(done) {
      var requestObj = {
        username: config.test.user.username,
        password: config.test.user.password + 'bad'
      };
      
      request(url).get('/api/users/' + config.test.user.id).send(requestObj).expect(401).end(function(err) {
        done(err);
      });
    });
    
  });
});

