/* global process */
/* global before */
/* global it */
/* global describe */
var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var pg = require('pg');
var config = require('../config.js');
var server = require('../server.js');


describe('Api', function() {
	var url = config.server.url;
	var testUser = {
		"username": config.test.user.username,
		"password": config.test.user.password,
		"id": config.test.user.id,
		"spending": config.test.user.spending
	};
	server.start();
	it('should return correct user corresponding to id, as json', function(done) {
		request(url).get('/api/users/' + testUser.id).expect('Content-Type', /json/).expect(200).expect(function(res) {
			assert.equal(undefined, undefined);
			res.body.should.have.property('username');
			res.body.username.should.equal(testUser.username);
		}).end(function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});
	
	it('should return correct spending corresponding to id, as json', function(done) {
		request(url).get('/api/users/' + testUser.id).expect('Content-Type', /json/).expect(200).expect(function(res) {
			res.body.should.have.property('spending');
			assert.deepEqual(res.body.spending, testUser.spending);
		}).end(function(err) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});
	});
	
	it('should return the correct number of filtered dates when query params are provided', function(done) {
		var params = '/api/users/' + testUser.id + '?from=' + config.test.filerDates.from + '&to=' + config.test.filerDates.to;

		request(url).get(params).expect('Content-Type', /json/).expect(200).expect(function(res) {
			res.body.should.have.property('spending');
			assert.deepEqual(res.body.spending.length, config.test.filerDates.expect);
		}).end(function(err) {
			done(err);
		})
	})
	
	it('should not create a new user when the username request already exists', function(done) {
		var postObject = {
			"username": testUser.username, 
			"password": testUser.password
		}
		
		request(url).post('/api/users').send(postObject).expect(403).end(function(err) {
			done(err);
		});
	});
	
	it('should create a new user when the username doesn\'t already exist', function(done) {
		var postObject = {
			"username": 'newUser',
			"password": 'password'
		}

		request(url).post('/api/users').send(postObject).expect(200).end(function(err) {
			//Delete user created
			var client = createDBClient();
			var query = client.query('DELETE FROM login WHERE username = $1', [postObject.username]);
			query.on('end', function() {
				client.end();
				done(err);
			});
		});
	});	
});

function createDBClient() {
  var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/spending_tracker_development';
  var client = new pg.Client(connectionString);
  client.connect();
  return client;
};