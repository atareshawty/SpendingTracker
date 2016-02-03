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
    
    it('should return an empty user if not provided a username', function(done) {
      db.findByUsername(null, function(err, user, password) {
        assert.equal(user, undefined, 'Should not return a user');
        assert.equal(user, undefined, 'Should not return a password');
        done();
      })
    });
    
    it('should return an empty user if username is not a string', function(done) {
      db.findByUsername(15, function(err, user, password) {
        assert.equal(user, undefined, 'Should not return a user');
        assert.equal(user, undefined, 'Should not return a password');
        done();  
      });
    });
    
    it('should not return a user or password if username.length is greater than 30', function(done) {
      db.findByUsername('this string should be greater than 30 characters', function(err, user, password) {
        assert.equal(user, null, 'User should be null');
        assert.equal(password, null, 'Password should be null');
        done();  
      });
    });
  });
  
  describe('Insert Purchase', function() {

    it('should insert transaction when all parameters are given', function(done) {
      var fake = {
        "cost": 10.99,
        "category": 'Entertainment',
        "location": 'Cleveland Cavaliers', 
        "date": '2015-12-25'
      };
      db.insertPurchase(testUser.username, fake, function() {
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
    
    it('should not insert transaction when date is not well formed', function(done) {
      var fake = {
        "cost": '10.99',
        "category": 'Entertainment',
        "location": 'Cleveland Cavaliers', 
        "date": '12/25/2015'
      };
      db.insertPurchase(testUser.username, fake, function(err) {
        assert(err != undefined, 'function should give error');
        assert(err != null, 'Function should give error');
        done();
      });
    });
    
    it('should not insert transaction when date is not a string', function(done) {
      var fake = {
        "cost": '10.99',
        "category": 'Entertainment',
        "location": 'Cleveland Cavaliers', 
        "date": /^\d{4}[-]\d{2}[-]\d{2}$/
      };
      db.insertPurchase(testUser.username, fake, function(err) {
        assert(err != undefined, 'function should give error');
        assert(err != null, 'Function should give error');
        done();
      });
    });
  });
  
  describe('Get Spending', function() {
    it('should not return spending or total when not given id', function(done) {
      db.getSpending(null, null, null, function(err, spending, total) {
        assert.deepEqual(spending, [], 'Spending should be empty array');
        assert.equal(total, 0, 'Total should be 0');
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
      db.getSpending(testUser.id, config.test.filterDates.from, config.test.filterDates.to, function(err, spending, total) {
        assert.equal(total, filterTotal, 'Totals should match');
        assert.deepEqual(spending, filterSpending, 'Spending arrays should pass deep equals (be in same order)');
        done();
      })
    });
    
    it('should return full spending when only given from filter date', function(done) {
      db.getSpending(testUser.id, config.test.filterDates.from, null, function(err, spending, total) {
        assert.deepEqual(spending, testUser.spending, 'Spending arrays should pass deep equals (be in same order)');
        assert.equal(total, testSpendingTotal, 'Totals should match');
        done();
      });
    });
    
    it('should return full spending when only given to filter date', function(done) {
      db.getSpending(testUser.id, null, config.test.filterDates.to, function(err, spending, total) {
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
  
  describe('Get Spending With Username', function() {
    var username = config.test.user.username;
    var testSpending = config.test.user.spending;
    var testFilteredSpending = config.test.filterSpending;
    var testTotal = config.test.user.total;
    var testFilteredTotal = config.test.filteredTotal;
    var from = config.test.filterDates.from;
    var to = config.test.filterDates.to;
    
    it('should return correct spending from username alone', function(done) {
      db.getSpendingWithUsername(username, function(err, spending, total) {
        assert.deepEqual(spending, testSpending, 'Spending should be the same');
        assert.equal(total, testTotal, 'Totals should be equal');
        done(err);
      });
    });
    
    it('should return filtered spending when provided dates', function(done) {
      db.getSpendingWithUsername(username, from, to, function(err, spending, total) {
        assert.deepEqual(spending, testFilteredSpending, 'Spending should be the same');
        assert.equal(total, testFilteredTotal, 'Totals should be equal');
        done(err);
      });
    })
  });
  
  describe('Create User', function() {
    it('should return error if the username already exists', function(done) {
      db.createUser(testUser.username, testUser.password, function(err, id) {
        assert(err != undefined, 'Should return an error');
        assert(err != null, 'Should return an error');
        done();
      });
    });
    
    it('should return an id for new user', function(done) {
      var fake = 'ThisGuyIsNotAUser';
      db.createUser(fake, 'password', function(err, id) {
        assert(id != undefined, 'Should return an id');
        var client = createDBClient();
        client.query('DELETE FROM users WHERE username = $1',[fake], function(err, result) {
          done(err);
        });
      });
    });

    it('should return an error when username.length > 30', function(done) {
      db.createUser('testUser.username .length should be greather than 30', 'neat', function(err, alreadyExists) {
        assert(err != undefined, 'Function should give error');
        assert(err != null, 'Function should give error');
        done();
      });
    });
  });
  
  describe('Insert New Category', function() {

    it('should insert category', function(done) {
      var insertClient = new pg.Client(connectionString);
      db.insertNewCategory(testUser.username, 'test', function(err) {
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
    
    it('should return an error if category is not a string', function(done) {
      db.insertNewCategory(testUser.username, ['Hi, I am an array!'], function(err) {
        assert(err != undefined, 'Function should give an error');
        assert(err != null, 'Function should give an error');
        done();
      });
    });
    
    it('should return an error if category.length > 20', function(done) {
      db.insertNewCategory(testUser.username, 'Hi, I am an string with length greater than 20!', function(err) {
        assert(err != undefined, 'Function should give an error');
        assert(err != null, 'Function should give an error');
        done();
      });
    });  
  });
  
  describe('Validate Date', function() {
    it('should return true with 2015-12-01', function(done) {
      assert(db.validateDate('2015-12-01'));
      done();
    });
    
    it('should return false with 2015/12/01', function(done) {
      assert(!db.validateDate('2015/12/01'));
      done();
    });
    
    it('should return false with 2015.12.01', function(done) {
      assert(!db.validateDate('2015.12.01'));
      done();
    });
    
    it('should return false with 2015-6-1', function(done) {
      assert(!db.validateDate('2015-6-1'));
      done();
    });
    
    it('should return false with non string input', function(done) {
      assert(!db.validateDate(['2015-12-06']));
      done();
    });
    
    it('should return false with [2015-12-06]', function(done) {
      assert(!db.validateDate('[2015-12-06]'));
      done();
    });    
  });
  
  describe('Validate Transaction', function() {
    it('should return true with all correct properties', function(done) {
      var trans = {
        "cost": 10.99,
        "category": 'Food',
        "location": 'Chipotle',
        "date": '2015-11-09'
      };
      assert(db.validateTransaction(trans));
      done();
    });
  
    it('should return false if cost is not a number', function(done) {
      var trans = {
        "cost": '10.99',
        "category": 'Food',
        "location": 'Chipotle',
        "date": '2015-11-09'
      };
      assert(!db.validateTransaction(trans));
      done();
    });
    
    it('should return false if cost is undefined', function(done) {
      var trans = {
        "category": 'Food',
        "location": 'Chipotle',
        "date": '2015-11-09'
      };
      assert(!db.validateTransaction(trans));
      done();
    });
    
    it('should return false if category is not a string', function(done) {
      var trans = {
        "cost": '10.99',
        "category": ['Food'],
        "location": 'Chipotle',
        "date": '2015-11-09'
      };
      assert(!db.validateTransaction(trans));
      done();
    });
    
    it('should return false if location is not a string', function(done) {
      var trans = {
        "cost": '10.99',
        "category": 'Food',
        "location": ['Chipotle'],
        "date": '2015-11-09'
      };
      assert(!db.validateTransaction(trans));
      done();
    });
    
    it('should return false if date is not well formed', function(done) {
      var trans = {
        "cost": '10.99',
        "category": 'Food',
        "location": 'Chipotle',
        "date": ['2015-11-09']
      };
      assert(!db.validateTransaction(trans));
      done();
    });
    
    it('should return false if date is not well formed', function(done) {
      var trans = {
        "cost": '10.99',
        "category": 'Food',
        "location": 'Chipotle',
        "date": '11/09/2015'
      };
      assert(!db.validateTransaction(trans));
      done();
    }); 
  });
  
  describe('Delete Individual Purchase', function() {
    var fake = {
      "cost": 10.99,
      "category": 'Entertainment',
      "location": 'Cleveland Cavaliers', 
      "date": '2015-12-25'
    };
    
    it('should delete one instance of the spending', function(done) {
      db.insertPurchase(testUser.username, fake, function(err) {
        if (err) {done(err);}
        db.deleteIndividualPurchase(testUser.username, fake, function(err) {
          if (err) {done(err);}
          var client = createDBClient();
          db.getSpendingWithUsername(testUser.username, function(err, spending) {
            if (err) {done(err);}
            assert.deepEqual(spending, testUser.spending, 'Spending should match');
            done();
          });
        });  
      });
    });
  })
});

function createDBClient() {
  var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/spending_tracker_development';
  var client = new pg.Client(connectionString);
  client.connect();
  return client;
};