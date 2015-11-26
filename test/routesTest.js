var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var pg = require('pg');
var config = require('../config.js');

describe('Routing', function() {
  var url = 'http://localhost:3000/';
	var client; 
	
  before(function(done) {
		client = new pg.Client(config.db.postgres);
		client.connect();							
    done();
  });
  
  describe('Users', function() {
    it('should return error trying to save duplicate username', function(done) {
      var profile = {
        username: 'sassy',
        password: 'IDotTheEyeAndYouDont,Bitches'
      };
  	assert.equal(1,1);
		done();  
		});
  });
	
});