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
console.log("Successfully started Spending Tracker!");

describe('Routing', function() {
  var url = 'http://localhost:3000';
  var testUsername = config.test.user.username;
  var testPassword = config.test.user.password;
  
  describe('Static', function() {
    it('should return 200 when base url is hit', function(done) {

      request(url).get('/').expect(200).end(function(err) {
        if (err) throw err;
        done();
      });
		});
    
    it('should return 200 when about page is hit', function(done) {

      request(url).get('/about').expect(200).end(function(err) {
        if (err) throw err;
        done();
      });
		});    
    
    it('should return 200 when 401 page is hit', function(done) {

      request(url).get('/').expect(200).end(function(err) {
        if (err) throw err;
        done();
      });
		});    
  });
  
  describe('Users', function() {
    var profile = {
      "username": testUsername,
      "password": testPassword
    };
    
    it('should return 403 when trying to signup with existing username', function(done) {
      request(url).post('/users/signup').send(profile).expect(403).end(function(err) {
        if (err) throw err;
        server.end();
        done();
      });
    });
  });
	
});

