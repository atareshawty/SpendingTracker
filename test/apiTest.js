/* global process */
/* global before */
/* global it */
/* global describe */
/**
 * ApiTest.js tests all model functionality (returning correct data, etc)
 */ 
var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var pg = require('pg');
var config = require('../config.js');


describe('Api', function() {
	var url = 'http://localhost:3000';
	var testUser = {
		"username": config.test.user.username,
		"password": config.test.user.password,
		"id": config.test.user.id,
		"spending": config.test.user.spending
	};
	
	it('should return correct user corresponding to id, as json', function(done) {
		request(url).get('/api/users').send({"id": testUser.id}).expect('Content-Type', /json/).expect(200).expect(function(res) {
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
		request(url).get('/api/users').send({"id": testUser.id}).expect('Content-Type', /json/).expect(200).expect(function(res) {
			assert.equal(undefined, undefined);
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
});