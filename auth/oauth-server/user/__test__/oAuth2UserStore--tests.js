var should = require('should');
var proxyquire = require('proxyquire');
var ObjectID = require('mongodb').ObjectID;
describe('oAuth2UserStore', () => {
	describe('fetchFromRequest()', () => {
		it('Returns the user from the express request', () =>{
			var user = {
				_id: 'smiddy',
				username: 'test'
			}
			var req = {
				user : user
			}
			var oAuth2UserStore = require('../oAuth2UserStore')({});
			var ret = oAuth2UserStore.fetchFromRequest(req);
			ret.should.equal(user);
		});
	});
	
	describe('getId()', () => {
		it('Returns the id from the user object', () =>{
			var user = {
				_id: new ObjectID(),
				username: 'test'
			}
			var oAuth2UserStore = require('../oAuth2UserStore')({});
			var ret = oAuth2UserStore.getId(user);
			ret.should.equal(user._id);
		});
	});
	
	describe('fetchById()', () => {
		it('Returns the user from the session', (done) =>{
			var user = {
				_id: new ObjectID(),
				username: 'test'
			}
			
			var oAuth2UserStore = require('../oAuth2UserStore')({
				userStore : {
					fetchById: () => Promise.resolve(user)
				}
			});
			
			oAuth2UserStore.fetchById(user._id, (error, ret) => {
				try {
					should.not.exist(error);
					ret.should.equal(user);
					done();
				} catch (err) {
					done(err);
				}
			});
		});
		
		it('Returns an error on a db error', (done) =>{
			
			var oAuth2UserStore = require('../oAuth2UserStore')({
				userStore : {
					fetchById: () => Promise.reject('err')
				}
			});
			oAuth2UserStore.fetchById(new ObjectID(), (error, user) => {
				try {
					should.exist(error);
					done();
				} catch (err) {
					done(err);
				}
			});
		});
	});
	
});