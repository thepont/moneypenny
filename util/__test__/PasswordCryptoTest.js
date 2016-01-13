var proxyquire = require('proxyquire');
var sinon = require('sinon');

describe('PasswordCrypto', () => {
	it('Recognizes hashes from the same passwords', () => {
		var PasswordCrypto = require('../PasswordCrypto');
				
		return PasswordCrypto.createHash('password').then(function(hash) {
				return PasswordCrypto.checkPassword('password', hash);
			});
	});
	
	it('Rejects if the hash does not match the password', (done) => {
		var PasswordCrypto = require('../PasswordCrypto');
				
		return PasswordCrypto.createHash('password').then(function(hash) {
				return PasswordCrypto.checkPassword('incorrect-password', hash);
			}).then(function(hash) {
					return done(Error('Promise should have rejected with error'));
				}).catch(function(err){
					return done();
			});
	});
	
	describe('createHash()', () => {
		it('Rejects if bcrypt.genSalt returns an error', (done)=> {
			var PasswordCrypto = proxyquire('../PasswordCrypto', {
				'bcrypt' : {
					genSalt : (workFactor, cb)=>{return cb('err');}
				}
			});
						
			return PasswordCrypto.createHash('password')
					.then(function(hash) {
						return done(Error('Promise should have rejected with error'));
					}).catch(function(err){
						return done();
					});
		});
		
		it('Rejects if bcrypt.hash returns an error', (done)=> {
			var PasswordCrypto = proxyquire('../PasswordCrypto', {
				'bcrypt' : {
						genSalt : (workFactor, cb)=>{return cb(null, 'pepper');},
						hash: (password,pepper, cb)=>{return cb('err');}
					}
				});
						
			return PasswordCrypto.createHash('password')
					.then(function(hash) {
						return done(Error('Promise should have rejected with error'));
					}).catch(function(err){
						return done();
					});
		});
		
	});
});