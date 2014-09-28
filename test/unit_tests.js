var assert = require("assert");
var should = require("should");
var supertest = require("supertest");
var User = require('../models/user');
var mongoose = require('mongoose');


before(function() {
    // create unit_tests database for testing locally
    // mongoose.connect('mongodb://localhost/unit_tests');
    mongoose.connect('mongodb://dmar:foobar@proximus.modulusmongo.net:27017/vix2Ivig');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback() {
    	// console.log('database connected successfully (in unit_tests.js)');
    });
})

// clear database before each test
beforeEach(function() {
	// console.log('beforeEach hook clearing database');
	mongoose.connection.db.dropDatabase();
})

// sanity check test ============================
describe('Sanity Checks', function() {
	it('should pass', function() { })

	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			assert.equal(-1, [1, 2, 3].indexOf(5));
			assert.equal(-1, [1, 2, 3].indexOf(0));
		})
	})
})

describe('User', function() {
	describe('Create A User', function() {
		it('should create user without error', function() {
			var newUser = new User();
			should.exist(newUser);
		});

		it('should create user with properties', function() {
			var newUser = new User();
			newUser.user = "dmar";
			newUser.password = "foobar";
			newUser.count = 1;
			newUser.should.have.property('user', 'dmar');
			newUser.should.have.property('password', 'foobar');
			newUser.should.have.property('count', '1');
		});

		it('should save user without error', function(done) {
			// console.log('save user without error?');
			User.add("test2", "foobar", function(result) {
				result.should.equal(1);
				done();
			});
		});

		it('should error when adding duplicate user', function(done) {
			User.add("test2", "foobar", function(result) {
				User.add("test2", "foobar", function(result) {
					result.should.equal(-2);
					done();
				})
			});
		});


		it('should error when adding user with no username', function(done) {
			User.add("", "foobar", function(result) {
				result.should.equal(-3);
				done();
			});
		});

		it('should error when adding user with user too long', function(done) {
			User.add("foobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarf", "foobar", function(result) {
				result.should.equal(-3);
				done();
			});
		});

		it('should error when adding user with password too long', function(done) {
			User.add("user", "foobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarfoobarf", function(result) {
				result.should.equal(-4);
				done();
			});
		});



		it('should login user with count 2', function(done) {
			User.add("test1", "foobar", function(result) {
				User.login("test1", "foobar", function(result) {
					result.should.equal(2);
					done();
				})
			});
		});

		it('should fail to login user because of bad crednentials', function(done) {
			User.add("some_user", "foobar", function(result) {
				User.login("test1", "foobar", function(result) {
					result.should.equal(-1);
					done();
				})
			});
		});

	})
})