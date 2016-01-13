var ObjectID = require('mongodb').ObjectID;
var should = require('should');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

describe('oAuth2RefreshTokenStore', () => {
	describe('getUserId()', () => {
		it('Gets the userId from the refresh token object', () =>{
			var refreshToken = {
				userId : new ObjectID()
			};
			var oAuth2RefreshTokenStore = require('../oAuth2RefreshTokenStore')({});
			var userId = oAuth2RefreshTokenStore.getUserId(refreshToken);
			userId.should.equal(refreshToken.userId);
		});
	});
	
	describe('getClientId()', () => {
		it('Gets the clientId from the refresh token object', () =>{
			var refreshToken = {
				clientId : new ObjectID()
			};
			var oAuth2RefreshTokenStore = require('../oAuth2RefreshTokenStore')({});
			var clientId = oAuth2RefreshTokenStore.getClientId(refreshToken);
			clientId.should.equal(refreshToken.clientId);
		});
	});
	
	describe('getScope()', () => {
		it('Gets the clientId from the refresh token object', () =>{
			var refreshToken = {
				scope : new ObjectID()
			};
			var oAuth2RefreshTokenStore = require('../oAuth2RefreshTokenStore')({});
			var scope = oAuth2RefreshTokenStore.getScope(refreshToken);
			scope.should.equal(refreshToken.scope);
		});
	});
	
	describe('create()', () => {
		it('Creates a token then calls back with the token', (done) =>{
			var oAuth2RefreshTokenStore = proxyquire('../oAuth2RefreshTokenStore', {
				'crypto' : {
					randomBytes : () => '12345'
				}
			})({
				refreshTokenStore : {
					save : () => Promise.resolve({})
				}
			});
			oAuth2RefreshTokenStore.create('userid','clientid','scope', (error, token) => {
				try{
					should.not.exist(error);
					token.should.equal('12345');
					done();
				} catch (err){
					done(err);
				}
			})
		});
		it('Calls back with an error if an error occours saving to db', (done) =>{
			var oAuth2RefreshTokenStore = require('../oAuth2RefreshTokenStore')({
				refreshTokenStore : {
					save : () => Promise.reject('err')
				}
			});
			oAuth2RefreshTokenStore.create('userid','clientid','scope', (error, token) => {
				try{
					should.exist(error);
					done();
				} catch (err){
					done(err);
				}
			})
		});	
	});
	describe('fetchByToken()', () => {
		it('Returns the token found in the database', (done) =>{
			var token = {
				token: '1234',
				userId: 'jsmith'
			}
			var oAuth2RefreshTokenStore = require('../oAuth2RefreshTokenStore')({
				refreshTokenStore : {
					fetchByToken : () => Promise.resolve(token)
				}
			});
			oAuth2RefreshTokenStore.fetchByToken('token', (error, token) => {
				try{
					should.not.exist(error);
					token.should.equal(token);
					done();
				} catch (err){
					done(err);
				}
			})
		});
		
		it('Returns an error on a database error', (done) =>{
			var oAuth2RefreshTokenStore = require('../oAuth2RefreshTokenStore')({
				refreshTokenStore : {
					fetchByToken : () => Promise.reject('err')
				}
			});
			oAuth2RefreshTokenStore.fetchByToken('token', (error, token) => {
				try{
					should.exist(error);
					done();
				} catch (err){
					done(err);
				}
			});
		});
	});
	describe('removeByUserIdClientId()', () => {
		it('Returns no error on success', (done) =>{
			var oAuth2RefreshTokenStore = require('../oAuth2RefreshTokenStore')({
				refreshTokenStore: {
					removeByUserIdClientId : () => Promise.resolve({})
				}
			});
			oAuth2RefreshTokenStore.removeByUserIdClientId('userId', 'clientid', (error) => {
				try{
					should.not.exist(error);
					done();
				} catch (err){
					done(err);
				}
			})
		});
		
		it('Returns an error on fail', (done) =>{
			var oAuth2RefreshTokenStore = require('../oAuth2RefreshTokenStore')({
				refreshTokenStore : {
					removeByUserIdClientId : () => Promise.reject('err')
				}
			});
			oAuth2RefreshTokenStore.removeByUserIdClientId('userId', 'clientid', (error) => {
				try{
					should.exist(error);
					done();
				} catch (err){
					done(err);
				}
			})
		})
	});
	describe('removeByRefreshToken()', () => {
		it('Returns no error on success', (done) =>{
			var oAuth2RefreshTokenStore = require('../oAuth2RefreshTokenStore')({
				refreshTokenStore: {
					removeByRefreshToken : () => Promise.resolve({})
				}
			});
			oAuth2RefreshTokenStore.removeByRefreshToken('token', (error) => {
				try{
					should.not.exist(error);
					done();
				} catch (err){
					done(err);
				}
			})
		});
		
		it('Returns an error on fail', (done) =>{
			var oAuth2RefreshTokenStore = require('../oAuth2RefreshTokenStore')({
				refreshTokenStore : {
					removeByRefreshToken : () => Promise.reject('err')
				}
			});
			oAuth2RefreshTokenStore.removeByRefreshToken('token', (error) => {
				try{
					should.exist(error);
					done();
				} catch (err){
					done(err);
				}
			})
		})
	});
}); 