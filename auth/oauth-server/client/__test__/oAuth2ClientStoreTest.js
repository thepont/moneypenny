var proxyquire = require('proxyquire');
var sinon = require('sinon');
var should = require('should');

const COLLECTION_SAVE_RETURN = Promise.resolve('save return');
const COLLECTION_FINDONE_RETURN = Promise.resolve('findOne return');

// var save = sinon.stub().returns(COLLECTION_SAVE_RETURN);
var findOne = sinon.stub().returns(COLLECTION_FINDONE_RETURN);


var storageProvider = {
			clientStore : {
				fetchById: Promise.resolve('return')
			}
		};
		
var oAuth2ClientStore = require('../oAuth2ClientStore')(storageProvider);



describe('oAuth2ClientStore', () => {
	describe('getId()', () => {
		it('Returns client.id', ()=> {
			var clientId = 'test_client';
			var returned = oAuth2ClientStore.getId({id:clientId})
			returned.should.be.exactly(clientId);
		});
	});
	describe('getRedirectUri()', () => {
		it('Returns client.redirectUri', ()=> {
			var redirectUri = 'test_client';
			var returned = oAuth2ClientStore.getRedirectUri({redirectUri:redirectUri})
			returned.should.be.exactly(redirectUri);
		});
	});
	describe('fetchById()', () => {
		it('Calls back with the oAuth client on correct id', (done)=> {
				var fakeClient = { 
					id: 'clientId',
					redirectUri: 'redirectUri',
					secret: 'secret'
				};
				
				var fakeStorageProvider = {
					clientStore : {
						fetchById: () => Promise.resolve(fakeClient)
					}
				}
			
			var oAuth2ClientStore = require('../oAuth2ClientStore')(fakeStorageProvider);
			
			oAuth2ClientStore.fetchById('clientId', (error, item)=>{
				try{
					should.not.exist(error);
					item.should.have.property('id', 'clientId');
					item.should.have.property('redirectUri', 'redirectUri');
					item.should.have.property('secret', 'secret');
					done();
				} catch(err){
					done(err);
				}
			});
		});
		it('Calls back with an error if unable to fetch client', (done)=> {
			
			var fakeStorageProvider = {
				clientStore : {
					fetchById: () => Promise.reject('ERROR')
				}
			}
			var oAuth2ClientStore = require('../oAuth2ClientStore')(fakeStorageProvider);
			
			oAuth2ClientStore.fetchById('clientId', (error, item)=>{
				try{
					should.exist(error);
					return done();
				} catch(err){
					return done(err);
				}
			});
		});
	});
	
	describe('checkPassword', ()=>{
		it('Call callback with true if password matches hash',(done)=>{
			var PasswordCrypto = require('moneypenny-server/util/PasswordCrypto');
			PasswordCrypto.createHash('test').then((hash)=>{
				oAuth2ClientStore.checkSecret({secret: hash},'test',(error, result)=>{
					try{
						should.not.exist(error);		
						result.should.equal(true);
						return done();
					} catch(err){
						return done(err);
					}
				});
			})
		});
		it('Call callback with false if password does not match hash',(done)=>{
			oAuth2ClientStore.checkSecret({secret: 'hash'},'hash',(error, result)=>{
					try{
						should.not.exist(error);		
						result.should.equal(false);
						return done();
					} catch(err){
						return done(err);
					}
			})
		});
	});

});