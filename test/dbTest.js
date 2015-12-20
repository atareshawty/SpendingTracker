/* global process */
/* global before */
/* global it */
/* global describe */ 
var assert = require('assert');  
var pg = require('pg');
var config = require('../config.js');
var db = require('../db/users.js');
var bcrypt = require('bcrypt-nodejs');

describe('Database Interaction', function() {
  var testUser = config.test.user;
  var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/spending_tracker_development';
  var client = new pg.Client(connectionString);
  var testSpendingTotal = 0;
  testUser.spending.forEach(function(element) {
    testSpendingTotal += element.cost;
  });
  testSpendingTotal.toPrecision(2);
  
  describe('Find By Username', function() {
    it('should return user if exists', function(done) {
      db.findByUsername(testUser.username, function(err, user, password) {
        assert.notEqual(user, undefined, 'User object should be returned');
        done();
      });
    });
    
    it('should return same username as requested', function(done) {
      db.findByUsername(testUser.username, function(err, user, password) {
        assert.equal(user.username, testUser.username, 'Usernames should match')
        done();
      });
    });
    
    it('ids should match', function(done) {
      db.findByUsername(testUser.username, function(err, user, password) {
        assert.equal(user.id, testUser.id, 'Id\'s should match');
        done();
      });
    });
    
    it('should not have new user if one does not exist', function(done) {
      db.findByUsername('thisGuyIsNotAUser!', function(err, user, password) {
        assert.equal(user, null, 'User should be null or undefined');
        assert.equal(password, undefined, 'Password should not come back');
        done();
      });
    });
    
    it('should return an error if not provided a username', function(done) {
      db.findByUsername(null, function(err, user, password) {
        assert(err != undefined, 'Should return an error');
        assert(err != null, 'Should return an error');
        done();
      })
    });
  });
  
  describe('Insert Transaction', function() {
    var fake = {
      "cost": 10.99,
      "category": 'Entertainment',
      "location": 'Cleveland Cavaliers', 
      "date": '2015-12-25'
    };
    
    it('should insert transaction when all parameters are given', function(done) {
      db.insertTransaction(testUser.id, fake, function() {
        client.connect();
        var queryString = 'SELECT * FROM spending WHERE id=$1 AND cost=$2 AND category=$3 AND location=$4 AND date=$5';
        var deleteQueryString = 'DELETE FROM spending WHERE id=$1 AND cost=$2 AND category=$3 AND location=$4 AND date=$5';
        var query = client.query(queryString, [testUser.id, fake.cost, fake.category, fake.location, fake.date]);
        query.on('error', function(err) {
          done(err);
        });
        
        query.on('end', function(result) {
          assert.equal(result.rowCount, 1, 'Row count returned from the db should equal 1');
          var deleteQuery = client.query(deleteQueryString, [testUser.id, fake.cost, fake.category, fake.location, fake.date]);
          deleteQuery.on('end', function() {
            client.end();
            done();
          });
        });
      });
    });
    
    it('should not insert transaction when all parameters are not present', function(done) {
      fake.cost = null;
      db.insertTransaction(testUser.id, fake, function(err) {
        assert(err != undefined, 'function should give error');
        assert(err != null, 'Function should give error');
        done();
      });
    });
  });
  
  describe('Get Spending', function() {
    it('should return an error when not given id', function(done) {
      db.getSpending(null, null, null, function(err, spending, total) {
        assert(err != undefined, 'Function should give error');
        assert(err != null, 'Function should give error');
        done();
      });
    });
    
    it('should return all spending and correct total when not provided filter dates', function(done) {
      db.getSpending(testUser.id, null, null, function(err, spending, total) {
        assert.equal(total, testSpendingTotal, 'Totals should match');
        assert.deepEqual(spending, testUser.spending);
        done();
      });
    });
    
    it('should return correct subset and correct total when provided filter dates', function(done) {
      var filterTotal = testUser.spending[1].cost + testUser.spending[2].cost;
      var filterSpending = [testUser.spending[1], testUser.spending[2]];
      db.getSpending(testUser.id, config.test.user.filterDates.from, config.test.user.filterDates.to, function(err, spending, total) {
        assert.equal(total, filterTotal, 'Totals should match');
        assert.deepEqual(spending, filterSpending, 'Spending arrays should pass deep equals (be in same order)');
        done();
      })
    });
    
    it('should return full spending when only given from filter date', function(done) {
      db.getSpending(testUser.id, config.test.user.filterDates.from, null, function(err, spending, total) {
        assert.deepEqual(spending, testUser.spending, 'Spending arrays should pass deep equals (be in same order)');
        assert.equal(total, testSpendingTotal, 'Totals should match');
        done();
      });
    });
    
    it('should return full spending when only given to filter date', function(done) {
      db.getSpending(testUser.id, null, config.test.user.filterDates.to, function(err, spending, total) {
        assert.deepEqual(spending, testUser.spending, 'Spending arrays should pass deep equals (be in same order)');
        assert.equal(total, testSpendingTotal, 'Totals should match');
        done();
      });
    });
    
    it('should return full spending when dates include all spending', function(done) {
      db.getSpending(testUser.id, '2014-01-01', '2016-12-31', function(err, spending, total) {
        assert.deepEqual(spending, testUser.spending, 'Spending arrays should pass deep equals (be in same order)');
        assert.equal(total, testSpendingTotal, 'Totals should match');
        done();        
      });
    });
   
    it('should return no spending when filter dates do not include any spending', function(done) {
      db.getSpending(testUser.id, '2014-01-01', '2014-12-31', function(err, spending, total) {
        assert.deepEqual(spending, new Array(), 'Arrays should be empty');
        assert.equal(total, 0, 'Totals should be 0');
        done();        
      });
    });  
  });
  
  describe('Insert Username And Password', function() {
    it('should return true if the username already exists', function(done) {
      db.insertUsernameAndPassword(testUser.username, testUser.password, function(err, alreadyExists) {
        assert(alreadyExists, 'alreadyExists should be true');
        done();
      });
    });
    
    it('should return an error when not given username', function(done) {
      db.insertUsernameAndPassword(null, testUser.password, function(err, alreadyExists) {
        assert(err != undefined, 'Function should give error');
        assert(err != null, 'Function should give error');
        done();
      });
    });
    
    it('should return an error when not given password', function(done) {
      db.insertUsernameAndPassword(testUser.username, null, function(err, alreadyExists) {
        assert(err != undefined, 'Function should give error');
        assert(err != null, 'Function should give error');
        done();
      });
    });
    
    it('should insert insert user info and already exists should be false', function(done) {
      var fake = {
        "username": 'notInDbYet',
        "password": 'password'
      };
      var insertClient = new pg.Client(connectionString);
      //Will need to change if real user is inserted with username 'notInDbYet'
      db.insertUsernameAndPassword(fake.username, fake.password, function(err, alreadyExists) {
        assert.equal(alreadyExists, false, 'Already exists should be false');
        insertClient.connect();
        var query = insertClient.query('SELECT * FROM login WHERE username=$1', [fake.username]);
        query.on('end', function(result) {
          assert.equal(result.rowCount, 1, 'Should have inserted only one user');
          var deleteQuery = insertClient.query('DELETE FROM login WHERE username=$1', [fake.username]);
          deleteQuery.on('end', function() {
            insertClient.end();
            done();
          });
        });
      });
    });
  });
  
  describe('Insert New Category', function() {
    it('should return an error if not given id', function(done) {
      db.insertNewCategory(null, 'Test', function(err) {
        assert(err != undefined, 'Function should give an error');
        assert(err != null, 'Function should give an error');
        done();
      });
    });
    
    it('should return an error if not given category', function(done) {
      db.insertNewCategory(testUser.id, null, function(err) {
        assert(err != undefined, 'Function should give an error');
        assert(err != null, 'Function should give an error');
        done();
      });
    });
    
    it('should insert category', function(done) {
      var insertClient = new pg.Client(connectionString);
      db.insertNewCategory(testUser.id, 'test', function(err) {
        insertClient.connect();
        var query = insertClient.query('SELECT * FROM categories WHERE id=$1 AND category=$2', [testUser.id, 'test']);
        query.on('end', function(result) {
          assert(result.rowCount === 1);
          var deleteQuery = insertClient.query('DELETE FROM categories WHERE id=$1 AND category=$2', [testUser.id, 'test']);
          deleteQuery.on('end', function() {
            insertClient.end();
            done();
          });
        });
      });
    });    
  });
});