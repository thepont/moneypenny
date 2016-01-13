var proxyquire = require('proxyquire');
var should = require('should');
var sinon = require('sinon');

describe('index', () => {
	describe('initialize', () => {
		
		var injectReturn = {test:'test123'};
		var tokenReturn = {test:'tokenTest'};
		var authorizationReturn = {test:'tokenTest'};
		var options = {storageProvider:{}};
		var moneypennyServer = proxyquire('../index.js', {
			'moneypenny-server/auth/oauth-server/oAuth2Server' : ()=>{
				return{
					inject : ()=> injectReturn,
					controller: {
						token:tokenReturn,
						authorization:authorizationReturn
					}
				}
			}
		})(options);
			
		// var moneypennyServer = require('../index.js')({storageProvider:{}});
		var use = sinon.stub();
		moneypennyServer.initialize({
			use: use
		});
		
		it('Calls oAuthServer.inject to inject oAuth framework', () => {
			
			use.calledWith(injectReturn).should.be.true();
		});
		it('Exposes the token endpoint ', () => {
			use.calledWith('/oauth2/token',tokenReturn).should.be.true();
		});
		it('Exposes the authorization endpoint', () => {
			use.calledWith('/oauth2/authorization',authorizationReturn).should.be.true();
		});
		// it('Requires authentication', () => {
		// 	use.calledWith(moneypennyServer.ensureAuthenticated).should.be.true();
		// });
	});
	
	describe('serializeUser', () => {
		it('Saves the user in the user store',(done) => {
			var save = sinon.stub().returns(Promise.resolve({_id: "test"}));
			var moneypennyServer = require('../index')({
				storageProvider : { 
					userStore : { 
						save : save 
						}}
			});
			moneypennyServer.serializeUser({}, (err, userId)=>{
				try{
					sinon.assert.calledOnce(save);
					should.not.exist(err);
					done();
				} catch(ex) {
					done(ex)
				}
			});
		});
		it('Throws an error if it fails to save the user', (done) => {
			var save = sinon.stub().returns(Promise.reject({_id: "test"}));
			var moneypennyServer = require('../index')({
				storageProvider : { 
					userStore : { 
						save : save 
						}}
			});
			moneypennyServer.serializeUser({}, (err, userId)=>{
				try{
					sinon.assert.calledOnce(save);
					should.exist(err);
					done();
				} catch(ex) {
					done(ex)
				}
			});
		});
	});
	
	describe('deserializeUser', () => {
		it('Deseralizes the user from the user store.', (done) => {
			var user = {
				_id : 'test'
			}
			var fetchById = sinon.stub().returns(Promise.resolve(user));
			var moneypennyServer = require('../index')({
				storageProvider : { 
					userStore : { 
						fetchById : fetchById 
						}}
			});
			moneypennyServer.deserializeUser('test', (err, userRet)=>{
				try{
					sinon.assert.calledOnce(fetchById);
					should.not.exist(err);
					userRet.should.equal(user);
					done();
				} catch(ex) {
					done(ex)
				}
			});
		});
		it('Throws an error if userStore returns an empty user.', () => {
			var fetchById = sinon.stub().returns(Promise.resolve());
			var moneypennyServer = require('../index')({
				storageProvider : { 
					userStore : { 
						fetchById : fetchById 
						}}
			});
			moneypennyServer.deserializeUser('test', (err, userRet)=>{
				try{
					sinon.assert.calledOnce(fetchById);
					should.exist(err);
					done();
				} catch(ex) {
					done(ex)
				}
			});
		});
		it('Throws an error if it fails to save the user.', () => {
			var fetchById = sinon.stub().returns(Promise.reject('err'));
			var moneypennyServer = require('../index')({
				storageProvider : { 
					userStore : { 
						fetchById : fetchById 
						}}
			});
			moneypennyServer.deserializeUser('test', (err, userRet)=>{
				try{
					sinon.assert.calledOnce(fetchById);
					should.exist(err);
					done();
				} catch(ex) {
					done(ex)
				}
			});
		});
	});
	
	describe('ensureAuthenticated', () => {
		var loginUrl = 'www.test.com';
		var moneypennyServer = require('../index')({storageProvider : {}, loginUrl: loginUrl});
		it('Redirects to loginUrl if a user is unauthenticated.', () => {
			var req = {
				isAuthenticated : () => false,
				originalUrl : 'http://1234.com/',
				session : {}
			};
			var res ={
				redirect : sinon.stub()
			};
			moneypennyServer.ensureAuthenticated(req, res);
			res.redirect.calledWith(loginUrl).should.be.true();
		});
		it('Attaches a URL for the user to return to on Authentication.',() => {
			var req = {
				isAuthenticated : () => false,
				originalUrl : 'http://1234.com/',
				session : {}
			};
			var res ={
				redirect : sinon.stub()
			};
			moneypennyServer.ensureAuthenticated(req, res);
			req.session.returnTo.should.equal(req.originalUrl);
			
		});
		it('It calls next middleware if user is authenticated.',() => {
			var req = {
				isAuthenticated : () => true,
				originalUrl : 'http://1234.com/',
				session : {}
			};
			var res ={
				redirect : sinon.stub()
			};
			var next = sinon.stub();
			moneypennyServer.ensureAuthenticated(req, res, next);
			sinon.assert.calledOnce(next);
		});
	});
	
	describe('loginAndRedirect', () => {
		var redirectUrl = '/user_details';
		var moneypennyServer = require('../index')({storageProvider : {}, redirectUrl: redirectUrl});
		it('Redirects the user to the location stored in the session', () => {
			var req = {
				isAuthenticated : () => true,
				session : {
					returnTo : 'http://1234.com/'
				}
			};
			var res ={
				redirect : sinon.stub()
			};
			moneypennyServer.loginAndRedirect(req,res);
			res.redirect.calledWith(req.session.returnTo).should.be.true();
		})
		it('Redirects the user to a default url if no location is found in the session', () => {
			var req = {
				isAuthenticated : () => true,
				session : {
				}
			};
			var res ={
				redirect : sinon.stub()
			};
			moneypennyServer.loginAndRedirect(req,res);
			res.redirect.calledWith(redirectUrl).should.be.true();
			
		})
	});
});