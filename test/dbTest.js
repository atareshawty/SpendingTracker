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
  
});