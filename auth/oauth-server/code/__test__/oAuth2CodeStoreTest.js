
var oAuthCodeStore = require('../oAuth2CodeStore')({codeStore : {}}, '');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var should = require('should');
var jwt = require('jsonwebtoken');


describe('oAuthCodeStore', () => {   
	describe('getUserId()', () => {
		it('Returns User Id from Authe2Code object', () =>{
			oAuthCodeStore.getUserId({userId:'test'}).should.equal('test');
		});
	});
	
	describe('getClientId()', () => {
		it('Returns User Id from Authe2Code object', () =>{
			oAuthCodeStore.getClientId({clientId:'test'}).should.equal('test');
		});
	});
	
	describe('getScope()', () => {
		it('Returns scope of the Authe2Code object', () =>{
			oAuthCodeStore.getScope({scope:'test'}).should.equal('test');
		});
	});
	
	describe('create()', () => {
		it('It calls back with a token', (done) => {
			var fakeStorageProvide =  {
				codeStore : {
					save :  (userid, clientid, scope, ttl) => Promise.resolve({
						userId: userid,
						clientId: clientid,
						scope: scope,
						ttl: ttl
					})
				}
			}
			
			var oAuthCodeStore = require('../oAuth2CodeStore')(fakeStorageProvide, 'secret');
				
			oAuthCodeStore.create('userid', 'client', 'ALL', 10000, (error, saved)=>{
				try{
					var decoded = jwt.decode(saved, 'secret');
					decoded.should.have.property('userId', 'userid');
					decoded.should.have.property('clientId', 'client');	
					decoded.should.have.property('scope', 'ALL');
					decoded.should.have.property('ttl', 10000);
					done();
				} catch (err){
					done(err);
				}
			});
		});
		
		it('Calls callback with error if an error occurs', (done) =>{
			var fakeStorageProvide =  {
				codeStore : {
					save :  (userid, clientid, scope, ttl) => Promise.reject('err')
				}
			}
			var oAuthCodeStore = require('../oAuth2CodeStore')(fakeStorageProvide, 'secret');
			oAuthCodeStore.create('userid', 'client', 'ALL', 10000, (error, saved)=>{
				try{
					should.exist(error);
					done();
				} catch (err){
					done(err);
				}
			});
		});
	});
	
	describe('fetchByCode()', () => {
		it('Returns oAuth code details from database if found', (done) =>{
			var fakeStorageProvide =  {
				codeStore : {
					fetchByCode :  (code) => Promise.resolve({
						userId: 'userId',
						clientId: 'clientId',
						scope: 'scope',
						ttl: 'ttl'
					})
				}
			}
			
			var oAuthCodeStore = require('../oAuth2CodeStore')(fakeStorageProvide, 'secret');
			oAuthCodeStore.fetchByCode('testcode', (error, item)=>{
				try{
					item.should.have.property('userId', 'userId');
					item.should.have.property('clientId', 'clientId');
					item.should.have.property('scope', 'scope');
					item.should.have.property('ttl', 'ttl');
					done();
				} catch (err){
					done(err);
				}
			});
			
		});
		
		it('Calls callback with error if an error occurs', (done) =>{
			var fakeStorageProvide =  {
				codeStore : {
					fetchByCode : (code) => Promise.reject('err')
				}
			}
			var oAuthCodeStore = require('../oAuth2CodeStore')(fakeStorageProvide, 'secret');
			oAuthCodeStore.fetchByCode('testcode', (error, saved)=>{
				try{
					should.exist(error);
					done();
				} catch (err){
					done(err);
				}
			});
		});
	});
	
	describe('removeByCode()', (done) => {
		var remove = sinon.stub().returns(Promise.resolve({}));
		it('Removes oAuth token whos code matches code', () =>{
			var fakeStorageProvide =  {
				codeStore : {
					removeByCode : remove
				}
			}
			var oAuthCodeStore = require('../oAuth2CodeStore')(fakeStorageProvide, 'secret');
			
			oAuthCodeStore.removeByCode('code', (error, saved)=>{
				try{
					remove.called.should.be.true();
					should.not.exist(error);
					done();
				} catch (err){
					done(err);
				}
			});
		});
		
		it('Calls callback with error if an error occurs', () => {
			var fakeStorageProvide =  {
				codeStore : {
					removeByCode : (code) => Promise.reject('err')
				}
			}
			var oAuthCodeStore = require('../oAuth2CodeStore')(fakeStorageProvide, 'secret');
			oAuthCodeStore.removeByCode('code', (error, saved)=>{
				try{
					should.exist(error);
					done();
				} catch (err){
					done(err);
				}
			});
		});
	});
												
	describe('checkTTL', ()=>{
		var fakeStorageProvide =  {
				codeStore : {
					save :  (userid, clientid, scope, ttl) => Promise.resolve({})
				}
			}
		var oAuthCodeStore = require('../oAuth2CodeStore')(fakeStorageProvide, 'secret');
		
		it('Returns true if the token is still valid', (done) => {
				oAuthCodeStore.create('userId', 'clinetId', 'scope', 10000000, (error, code) => {
					try{
						oAuthCodeStore.checkTTL({code : code}).should.equal(true);
						done();
					} catch (err){
						done(err);
					}
				})
		});
		it('Returns false if the token is no longer valid', (done) => {
			oAuthCodeStore.create('userId', 'clinetId', 'scope', -1, (error, code) => {
				try{
					oAuthCodeStore.checkTTL({ code : code}).should.equal(false);
					done();
				} catch (err){
					done(err);
				} 
			});
		});
	});
});
