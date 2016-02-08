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
var db = require('../db/users.js');
var pg = require('pg');
var dbConnectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/spending_tracker_development';

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
  
  describe('Post Spending', function() {
    it('Should enter spending in the database when request is correct', function(done) {
      var postObject = {
        username: config.test.user.username,
        password: config.test.password,
        cost: 1099,
        category: 'Food', 
        location: 'McDonalds',
        date: '2016-02-03'
      };
      var expectedSpending = config.test.user.spending.slice();
      var expectedTotal = config.test.user.total + postObject.cost;
      expectedSpending.push({
        cost: 1099,
        category: 'Food',
        location: 'McDonalds',
        date: '2016-02-03'
      });
      
      request(url).post('/api/spending/' + config.test.user.username).send(postObject).end(function(err, result) {
        assert.equal(result.status, 200, 'Should get back 200 code');
        db.getSpendingWithUsername(config.test.user.username, function(err, spending, total) {
          //Make test assertions
          assert.deepEqual(spending, expectedSpending, 'Spending should be equal');
          assert.equal(total, expectedTotal, 'Totals should be equal');
          
          //Clean up post data from database
          var client = new pg.Client(dbConnectionString);
          client.connect();
          var queryString = 'DELETE FROM spending WHERE id=$1 AND date=$2';
          var query = client.query(queryString, [config.test.user.id, postObject.date]);
          query.on('error', function(err) {done(err); client.end();});
          query.on('end', function() {done(); client.end();});
        });
      });
    });
    
    it('Should give a 401 when not provided correct credentials', function(done) {
      var postObject = {
        username: config.test.user.username,
        password: config.test.password + 'bad',
        cost: 1099,
        category: 'Food', 
        location: 'McDonalds',
        date: '2016-02-03'
      };
      
      request(url).post('/api/spending/' + config.test.user.username).send(postObject).end(function(err, result) {
        assert.equal(result.status, 401, 'Should give a 401');
        done(err);
      });
    });
    
  });
  
  describe('Post Category', function() {
    it('Should enter category in the database when request is correct', function(done) {
      var postObject = {
        username: config.test.user.username,
        password: config.test.password,
        category: 'New Test Category'
      };
      
      request(url).post('/api/category/' + config.test.user.username).send(postObject).end(function(err, result) {
        assert.equal(result.status, 200, 'Should get back 200 code');
        var client = new pg.Client(dbConnectionString);
        client.connect();
        var queryString = 'SELECT category FROM categories WHERE id=(SELECT id FROM users WHERE username=$1)'
        var deleteQueryString = 'DELETE FROM categories WHERE category=$1';
        //Get new category from db to see if it matches the one sent
        var query = client.query(queryString, [config.test.user.username]);
 
        query.on('error', function(err) {done(err);});
        query.on('row', function(row) {
          assert.equal(row.category, postObject.category, 'Categories should match');
        });
        query.on('end', function() {
          //Remove new category so test can run again
          var deleteQuery = client.query(deleteQueryString, [postObject.category]);
          deleteQuery.on('error', function(err) {done(err);});
          deleteQuery.on('end', function() {done()});
        });
      });
    });
    
    it('Should give a 401 when not provided correct credentials', function(done) {
      var postObject = {
        username: config.test.user.username,
        password: config.test.password + 'bad',
        category: 'Does not matter'
      };
      
      request(url).post('/api/category/' + config.test.user.username).send(postObject).end(function(err, result) {
        assert.equal(result.status, 401, 'Should give a 401');
        done(err);
      });
    });
  });
  
  describe('Delete Spending', function() {
    it('should delete spending given all details of the purchase', function(done) {
      var fakePurchase = {
        "cost": 1099,
        "category": 'Entertainment',
        "location": 'Cleveland Cavaliers', 
        "date": '2015-12-25'
      };
      var deleteObject = {
        username: config.test.user.username,
        password: config.test.password,
        cost: fakePurchase.cost,
        category: fakePurchase.category,
        location: fakePurchase.location,
        date: fakePurchase.date
      };
      db.insertPurchase(config.test.user.username, fakePurchase, function(err) {
        if (err) {done(err);}
        request(url).delete('/api/spending/' + config.test.user.username).send(deleteObject).end(function(err, result) {
          if (err) {done(err);}
          db.getSpendingWithUsername(config.test.user.username, function(err, spending, total) {
            if (err) {done(err);}
            assert.deepEqual(spending, config.test.user.spending);
            done();
          });
        })
      })
    });
    
    it('should return a 401 when the request is not authenticated', function(done) {
      var deleteObject = {
        username: config.test.user.username,
        password: config.test.password + 'bad'
      };
      
      request(url).delete('/api/spending/' + config.test.user.username).send(deleteObject).end(function(err, result) {
        if (err) {done(err);}
        assert.equal(result.status, 401, 'Should give back a 401');
        done();
      })
    });
    
    it('should return a 400 with bad purchase form', function(done) {
      var deleteObject = {
        username: config.test.user.username,
        password: config.test.password,
        cost: 1099,
        category: 'category',
        date: 'bad format',
        location: 'Kroger'
      };
      
      request(url).delete('/api/spending/' + config.test.user.username).send(deleteObject).end(function(err, result) {
        assert.equal(result.status, 400, 'Should return a 400');
        done(err);
      });
    });
  });
});

