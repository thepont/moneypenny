// var proxyquire = require('proxyquire');
// var sinon = require('sinon');
// var should = require('should');

// var {ObjectID} = require('mongodb');
// var loginRedirect = '/local/login';
// var defaultRedirect = '/local/details';
// var strategy = 'local';

// describe('AuthStrategy', ()=>{
// 	describe('passport.serializeUser', ()=>{
// 		it('Saves the user into the SessionUserApiStore and returns the id', (done) => {
// 			var id = new ObjectID();
// 			var serializeUserFunc;
// 			var authStategy = proxyquire('../AuthStrategy', {
// 				passport: {
// 					authenticate: (stratergy, cb) => () => cb(null, {}),
// 					use: () => {},
// 					serializeUser: (func) => {
// 						serializeUserFunc = func;
// 					},
// 					deserializeUser: (func) => {},
// 				},
// 				'moneypenny-server/auth/session/SessionUserApiStore' : {
// 					save : () => Promise.resolve({_id:id})
// 				}
// 			})
// 			serializeUserFunc('user', (err, userId)=>{
// 				try {
// 					should.not.exist(err);
// 					userId.should.equal(id);
// 					done();
// 				} catch(err) {
// 					done(err);
// 				}
// 			});
// 		});
// 		it('Calls back with an error if it cant save to db', (done) => {
// 			var id = new ObjectID();
// 			var serializeUserFunc;
// 			proxyquire('../AuthStrategy', {
// 				passport: {
// 					authenticate: (stratergy, cb) => () => cb(null, {}),
// 					use: () => {},
// 					serializeUser: (func) => {
// 						serializeUserFunc = func;
// 					},
// 					deserializeUser: (func) => {},
// 				},
// 				'moneypenny-server/auth/session/SessionUserApiStore' : {
// 					save : () => Promise.reject('err')
// 				}
// 			})
// 			serializeUserFunc('user', (err, userId)=>{
// 				try {
// 					should.exist(err);
// 					done();
// 				} catch(err) {
// 					done(err);
// 				}
// 			});
// 		});
// 	});
	
// 	describe('passport.deserializeUser', ()=>{
// 		it('Returns the user if it is found in the database', (done) => {
// 			var id = new ObjectID();
// 			var user = {
// 				username: 'test'
// 			}
// 			var deserializeUserFunc;
// 			proxyquire('../AuthStrategy', {
// 				passport: {
// 					authenticate: (stratergy, cb) => () => cb(null, {}),
// 					use: () => {},
// 					deserializeUser: (func) => {
// 						deserializeUserFunc = func;
// 					},
// 					serializeUser: (func) => {},
// 				},
// 				'moneypenny-server/auth/session/SessionUserApiStore' : {
// 					load : () => Promise.resolve(user)
// 				}
// 			})
// 			deserializeUserFunc(id, (err, userRet)=>{
// 				try {
// 					userRet.should.equal(user);
// 					done();
// 				} catch(err) {
// 					done(err);
// 				}
// 			});
// 		});
// 		it('Returns an error if no user is found', (done) => {
// 			var id = new ObjectID();
// 			var deserializeUserFunc;
// 			proxyquire('../AuthStrategy', {
// 				passport: {
// 					authenticate: (stratergy, cb) => () => cb(null, {}),
// 					use: () => {},
// 					deserializeUser: (func) => {
// 						deserializeUserFunc = func;
// 					},
// 					serializeUser: (func) => {},
// 				},
// 				'moneypenny-server/auth/session/SessionUserApiStore' : {
// 					load : () => Promise.resolve()
// 				}
// 			})
// 			deserializeUserFunc(id, (err, userRet)=>{
// 				try {
// 					should.exist(err);
// 					done();
// 				} catch(err) {
// 					done(err);
// 				}
// 			});
			
// 		});
// 		it('Returns an error on db fail', (done) => {
// 			var id = new ObjectID();
// 			var deserializeUserFunc;
// 			proxyquire('../AuthStrategy', {
// 				passport: {
// 					authenticate: (stratergy, cb) => () => cb(null, {}),
// 					use: () => {},
// 					deserializeUser: (func) => {
// 						deserializeUserFunc = func;
// 					},
// 					serializeUser: (func) => {},
// 				},
// 				'moneypenny-server/auth/session/SessionUserApiStore' : {
// 					load : () => Promise.reject('err')
// 				}
// 			})
// 			deserializeUserFunc(id, (err, userRet)=>{
// 				try {
// 					should.exist(err);
// 					done();
// 				} catch(err) {
// 					done(err);
// 				}
// 			});
		
// 		});
// 	});
	
	
	
	
// 	describe('loginAndRedirect', ()=>{
// 		it('Redirects to authentication page if required', () => {
// 			var authStrategy = require('../AuthStrategy');
// 			var req = {
// 				isAuthenticated : () => false,
// 				path : 'test'
// 			}
// 			var res = {
// 				redirect :  sinon.stub().returns({})
// 			}
// 			authStrategy.ensureAuthenticated(req, res);
			
// 			res.redirect.calledWithMatch(authStrategy.loginRedirectUrl).should.be.true();
// 		});
		
// 		it('Redirects calls next without error if user is authenticated', () => {
// 			var next = sinon.stub();
// 			var authStrategy = require('../AuthStrategy');
// 			var req = {
// 				isAuthenticated : () => true
// 			}
// 			var res = {
// 			}
// 			authStrategy.ensureAuthenticated(req, res, next);
// 			next.calledWithMatch(null).should.be.true();
// 		});
		
// 		it('Redirects calls next without error if user is does not autentication for page', () => {
// 			var next = sinon.stub();
// 			var authStrategy = require('../AuthStrategy');
// 			var req = {
// 				isAuthenticated : () => false,
// 				path : '/login.html'
// 			}
// 			var res = {
// 			}
// 			authStrategy.ensureAuthenticated(req, res, next);
// 			next.calledWithMatch(null).should.be.true();
// 		});
		
// 		it('Saves path to return for session if exists', () => {
// 			var next = sinon.stub();
// 			var authStrategy = require('../AuthStrategy');
// 			var req = {
// 				isAuthenticated : () => false,
// 				path : 'test',
// 				session : {},
// 				originalUrl: 'test'
// 			}
// 			var res = {
// 				redirect: () => {}
// 			}
// 			authStrategy.ensureAuthenticated(req, res, next);
// 			req.session.returnTo.should.equal(req.path);
// 		});
		
// 	});
// 	describe('loginAndRedirect', ()=>{
// 		it('Returns an error to the next middleware if an error occours', (done) => {
// 			var authStategy = proxyquire('../AuthStrategy', {
// 				passport: {
// 					authenticate: (stratergy, cb) => () => cb('err'),
// 					use: () => {},
// 					serializeUser: () => {},
// 					deserializeUser: () => {},
// 				}
// 			})
// 			var loginAndRedirect = authStategy.loginAndRedirect(loginRedirect,defaultRedirect,strategy);
// 			loginAndRedirect(null, null, (err) => {
// 				should.exist(err);
// 				done();
// 			});
// 		});
// 		it('Redirects to the login page if no user is found', () => {
			
// 			var authStategy = proxyquire('../AuthStrategy', {
// 				passport: {
// 					authenticate: (stratergy, cb) => () => cb(null, null),
// 					use: () => {},
// 					serializeUser: () => {},
// 					deserializeUser: () => {},
// 				}
// 			})
// 			var res = {
// 				redirect: sinon.stub().returns({})
// 			}
// 			var loginAndRedirect = authStategy.loginAndRedirect(loginRedirect,defaultRedirect,strategy);
			
// 			loginAndRedirect(null, res, (err) => {
// 				should.not.exist(err);
// 			});
// 			res.redirect.calledWithMatch(loginRedirect).should.be.true();
// 		});					
// 		it('It logs the user in and redirects to the user redirect url if found', () => {
			
// 			var authStategy = proxyquire('../AuthStrategy', {
// 				passport: {
// 					authenticate: (stratergy, cb) => () => cb(null, {}),
// 					use: () => {},
// 					serializeUser: () => {},
// 					deserializeUser: () => {},
// 				}
// 			})
// 			var loginAndRedirect = authStategy.loginAndRedirect(loginRedirect,defaultRedirect,strategy);
// 			var res = {
// 				redirect: sinon.stub().returns({})
// 			}
// 			var req = {
// 				logIn : (user, cb) => cb(),
// 				session : {
// 					returnTo : 'UrlGoesHere'
// 				}
// 			};
			
// 			loginAndRedirect(req, res, (err) => {
// 				should.not.exist(err);
// 			});
// 			res.redirect.calledWithMatch(req.session.returnTo).should.be.true();
			
// 		});
// 		it('It logs the user in and redirects to the user /local/details if redirect not found', () => {
// 			var authStategy = proxyquire('../AuthStrategy', {
// 				passport: {
// 					authenticate: (stratergy, cb) => () => cb(null, {}),
// 					use: () => {},
// 					serializeUser: () => {},
// 					deserializeUser: () => {},
// 				}
// 			})
// 			var loginAndRedirect = authStategy.loginAndRedirect(loginRedirect,defaultRedirect,strategy);
			
// 			var res = {
// 				redirect: sinon.stub().returns({})
// 			}
// 			var req = {
// 				logIn : (user, cb) => cb(),
// 				session : {
// 				}
// 			};
			
// 			loginAndRedirect(req, res, (err) => {
// 				should.not.exist(err);
// 			});
// 			res.redirect.calledWithMatch('/local/details').should.be.true();
// 		});
// 		it('Returns an error to the next middleware if an error occours logging in', (done) => {
// 			var authStategy = proxyquire('../AuthStrategy', {
// 				passport: {
// 					authenticate: (stratergy, cb) => () => cb(null, {}),
// 					use: () => {},
// 					serializeUser: () => {},
// 					deserializeUser: () => {},
// 				}
// 			})
// 			var loginAndRedirect = authStategy.loginAndRedirect(loginRedirect,defaultRedirect,strategy);
// 			var res = {
// 				redirect: sinon.stub().returns({})
// 			}
// 			var req = {
// 				logIn : (user, cb) => cb('err'),
// 				session : {
// 				}
// 			};
			
// 			loginAndRedirect(req, res, (err) => {
// 				should.exist(err);
// 				done()
// 			});
// 		});
// 	});
// })
	