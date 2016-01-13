
var oAuth2TokenStore = require('../oAuth2TokenStore')({});
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var should = require('should');
var ObjectID = require('mongodb').ObjectID;

const TEST_SECRET = 'secret';

describe('oAuth2TokenStore', () => {   
	describe('getToken()', () => {
		it('Gets the token from the oAuth2Token object', () =>{
			oAuth2TokenStore.getToken({token:'test'}).should.equal('test');
		});
	});
	
	describe('create()', () => {
		it('Creates a new oAuth2 code.', (done) =>{
			var collectionSave = sinon.stub().returns(Promise.resolve({}));
			var userId = new ObjectID();
			var oAuth2TokenStore = require('../oAuth2TokenStore')({
				userStore : {
					fetchById : () => Promise.resolve({userName:'test'})
				}, 
				tokenStore : {
					save : collectionSave
				}
			}, TEST_SECRET);
						
			oAuth2TokenStore.create(userId, 'client', 'ALL', 10000, (error, accessToken)=>{
				try{
					should.not.exist(error);
					collectionSave.args[0][0].should.have.property('userId', userId);
					collectionSave.args[0][0].should.have.property('clientId', 'client');						
					collectionSave.args[0][0].should.have.property('scope', 'ALL');
					done();
				}catch (err){
					done(err);
				}
			});
		});
		
		it('Calls callback with error if an error occours while loading the user', (done) =>{
			var collectionSave = sinon.stub().returns(Promise.resolve({}));
			var userId = new ObjectID();
			
			var oAuth2TokenStore = require('../oAuth2TokenStore')({
				userStore : {
					fetchById : () => Promise.reject('')
				}, 
				tokenStore : {
					save : collectionSave
				}
			}, TEST_SECRET);
			
			oAuth2TokenStore.create(userId, 'client', 'ALL', 10000, (error, accessToken)=>{
				try{
					should.exist(error);
					done();
				}catch (err){
					done(err);
				}
			});
		});
		
		it('Calls callback with error if an error occurs while saving the token', (done) =>{
			var userId = new ObjectID();
			
			var oAuth2TokenStore = require('../oAuth2TokenStore')({
				userStore : {
					fetchById : () => Promise.resolve({userName:'test'})
				}, 
				tokenStore : {
					save : Promise.reject({})
				}
			}, TEST_SECRET);
			oAuth2TokenStore.create(userId, 'client', 'ALL', 10000, (error, accessToken)=>{
				try{
					should.exist(error);
					done();
				}catch (err){
					done(err);
				}
			});
		});
		
	});
	
	describe('fetchByToken()', () => {
		it('Returns oAuth token from database if found', () =>{
			var oAuth2TokenStore = require('../oAuth2TokenStore')({
				userStore : {
				}, 
				tokenStore : {
					fetchByToken : () => Promise.resolve({
						userId: 'userId',
            			clientId: 'clientId',
            			scope: 'scope',
						token: 'token'
					})
				}
			}, TEST_SECRET);
			oAuth2TokenStore.fetchByToken('testcode', (error, item)=>{
				try{
					item.should.have.property('userId', 'userId');
					item.should.have.property('clientId', 'clientId');
					item.should.have.property('scope', 'scope');
					item.should.have.property('token', 'token');
					done();
				} catch (err){
					done(err);
				}
			});
			
		});
		
		it('Calls callback with error if an error occours', (done) =>{
			
			var oAuth2TokenStore = require('../oAuth2TokenStore')({
				userStore : {
				}, 
				tokenStore : {
					fetchByToken : () => Promise.reject({})
				}
			}, TEST_SECRET);
			oAuth2TokenStore.fetchByToken('testcode', (error, saved)=>{
				try{
					should.exist(error);
					done();
				} catch (err){
					done(err);
				}
			});
		});
	});
	
	describe('checkTTL()', () => {
		it('Returns true if the token is still valid', (done)=> {
			
			var oAuth2TokenStore = require('../oAuth2TokenStore')({
				userStore : {
					fetchById : () => Promise.resolve({userName:'test'})
				}, 
				tokenStore : {
					save : () => Promise.resolve({})
				}
			}, TEST_SECRET);
			oAuth2TokenStore.create(new ObjectID(), 'client', 'ALL', 10000, (error, token)=>{
				try{
					oAuth2TokenStore.checkTTL({token : token}).should.equal(true);
					done();
				} catch (err){
					done(err);
				}
			});
		});
		it('Returns false if the token is no longer valid', (done)=> {
			var oAuth2TokenStore = require('../oAuth2TokenStore')({
				userStore : {
					fetchById : () => Promise.resolve({userName:'test'})
				}, 
				tokenStore : {
					save : () => Promise.resolve({})
				}
			}, TEST_SECRET);
			
			oAuth2TokenStore.create(new ObjectID(), 'client', 'ALL', -10000, (error, token)=>{
				try{
					oAuth2TokenStore.checkTTL({token : token}).should.equal(false);
					done();
				} catch (err){
					done(err);
				}
			});
			
		});
		
	});
	
	describe('getTTL()', () => {
		it('Get the current TTL', () =>{
			var ttl = 10000;
			var currentTtl = oAuth2TokenStore.getTTL({expiresAt:  new Date((new Date()).getTime() + ttl)});
			currentTtl.should.be.approximately(10000, 30);
		});
	});
	
	describe('fetchByUserIdClientId()', () => {
		it('Fetch the token by user and clientid', (done) =>{
			var oAuth2TokenStore = require('../oAuth2TokenStore')({
				tokenStore : {
					fetchByUserIdClientId : () => Promise.resolve({'test':'test'})
				}
			}, TEST_SECRET);
				
			oAuth2TokenStore.fetchByUserIdClientId(new ObjectID(), 'test', (error, token)=>{
				try{
					should.not.exist(error);
					token.should.have.property('test', 'test');
					done();
				} catch (err){
					done(err);
				}
			});
		});
		
		it('Returns an error if it fails to fetch the token', (done) =>{
			
			var oAuth2TokenStore = require('../oAuth2TokenStore')({
				tokenStore : {
					fetchByUserIdClientId : () => Promise.reject({})
				}
			}, TEST_SECRET);

			oAuth2TokenStore.fetchByUserIdClientId(new ObjectID(), 'test', (error, token)=>{
				try{
					should.exist(error);
					done();
				} catch (err){
					done(err);
				}
			});
		});
	});
});
