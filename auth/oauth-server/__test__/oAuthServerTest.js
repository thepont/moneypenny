var should = require('should');
var proxyquire = require('proxyquire');
var sinon = require('sinon');

describe('oAuthServerTest', () => {
	it('Sets model.client functions for oauth20-provider', () => {
		var oAuth2 = proxyquire('../oAuth2Server', {
			'moneypenny-server/auth/oauth-server/client/oAuth2ClientStore' :() => {
				return {
					getId: () => {},
					getRedirectUri: () => {},
					fetchById: () => {},
					checkSecret: () => {}
				}
			}
			
		})({storageProvider :{}});
		
		oAuth2.model.client.getId.should.be.Function();
		oAuth2.model.client.getRedirectUri.should.be.Function();
		oAuth2.model.client.fetchById.should.be.Function();
		oAuth2.model.client.checkSecret.should.be.Function();
		
		oAuth2.model.client.getId();
		oAuth2.model.client.getRedirectUri();
		oAuth2.model.client.fetchById();
		oAuth2.model.client.checkSecret();
	});
	it('Sets model.refreshToken functions for oauth20-provider', () => {
		
		
		var oAuth2 = proxyquire('../oAuth2Server', {
			'moneypenny-server/auth/oauth-server/refresh-token/oAuth2RefreshTokenStore' : () => {
				return {
					getUserId: () => {},
					getClientId: () => {},
					getScope: () => {},
					fetchByToken: () => {},
					removeByUserIdClientId: () => {},
					removeByRefreshToken: () => {},
					create: () => {},
				}
			}
		})({storageProvider :{}});
		
		
		oAuth2.model.refreshToken.getUserId.should.be.Function();
		oAuth2.model.refreshToken.getClientId.should.be.Function();
		oAuth2.model.refreshToken.getScope.should.be.Function();
		oAuth2.model.refreshToken.fetchByToken.should.be.Function();
		oAuth2.model.refreshToken.removeByUserIdClientId.should.be.Function();
		oAuth2.model.refreshToken.removeByRefreshToken.should.be.Function();
		oAuth2.model.refreshToken.create.should.be.Function();
		
		oAuth2.model.refreshToken.getUserId()
		oAuth2.model.refreshToken.getClientId()
		oAuth2.model.refreshToken.getScope()
		oAuth2.model.refreshToken.fetchByToken()
		oAuth2.model.refreshToken.removeByUserIdClientId()
		oAuth2.model.refreshToken.removeByRefreshToken()
		oAuth2.model.refreshToken.create()
	});
	
	it('Sets model.accessToken functions for oauth20-provider', () => {
		
		var oAuth2 = proxyquire('../oAuth2Server', {
			'moneypenny-server/auth/oauth-server/token/oAuth2TokenStore' : () => {
				return {
					getToken: () => {},
					fetchByToken: () => {},
					fetchByUserIdClientId: () => {},
					removeByRefreshToken: () => {},
					create: () => {},
					checkTTL: () => {},
					getTTL: () => {}
				}
			}
		})({storageProvider :{}});
		
		oAuth2.model.accessToken.getToken.should.be.Function();
		oAuth2.model.accessToken.fetchByToken.should.be.Function();
		oAuth2.model.accessToken.checkTTL.should.be.Function();
		oAuth2.model.accessToken.getTTL.should.be.Function();
		oAuth2.model.accessToken.fetchByUserIdClientId.should.be.Function();
		oAuth2.model.accessToken.create.should.be.Function();
		
		oAuth2.model.accessToken.getToken();
		oAuth2.model.accessToken.fetchByToken();
		oAuth2.model.accessToken.checkTTL();
		oAuth2.model.accessToken.getTTL();
		oAuth2.model.accessToken.fetchByUserIdClientId();
		oAuth2.model.accessToken.create();
	});
	
	it('Sets model.user functions for oauth20-provider', () => {
		var oAuth2 = proxyquire('../oAuth2Server', {
			'moneypenny-server/auth/oauth-server/user/oAuth2UserStore' : () => {
				return {
					fetchFromRequest: () => {},
					getId: () => {}
				}
			}
		})({storageProvider :{}});
		
		oAuth2.model.user.fetchFromRequest.should.be.Function();
		oAuth2.model.user.getId.should.be.Function();

		oAuth2.model.user.fetchFromRequest();
		oAuth2.model.user.getId();
	})
	
	it('Sets model.code functions for oauth20-provider', () => {
		
		var oAuth2 = proxyquire('../oAuth2Server', {
			'moneypenny-server/auth/oauth-server/code/oAuth2CodeStore': () => {
				return {
					create: () => {},
					fetchByCode: () => {},
					removeByCode: () => {},
					getUserId: () => {},
					getClientId: () => {},
					getScope: () => {},
					checkTTL: () => {},
				}
			}
		})({storageProvider :{}});
		
		oAuth2.model.code.getUserId.should.be.Function();
		oAuth2.model.code.getClientId.should.be.Function();
		oAuth2.model.code.getScope.should.be.Function();
		oAuth2.model.code.fetchByCode.should.be.Function();
		oAuth2.model.code.removeByCode.should.be.Function();
		oAuth2.model.code.create.should.be.Function();
		
		oAuth2.model.code.getUserId();
		oAuth2.model.code.getClientId();
		oAuth2.model.code.getScope();
		oAuth2.model.code.fetchByCode();
		oAuth2.model.code.removeByCode();
		oAuth2.model.code.create();
	});
	
	describe('decision()', () => { 
		it('Automatically decides for the user to Authorize the server', (done) => {
			
			var oAuth2 = require('../oAuth2Server')({storageProvider :{}});
			oAuth2.controller.authorization = (req, res) => {
				//Check that we are called with the correct parameters
				try{
					req.body.decision.should.equal(1);
					req.method.should.equal('POST');
					done()
				} catch (err){
					done(err);
				}
			};
			var req = {
				body : {},
			}
			var res = {}
			oAuth2.decision(req,res);
		});
	});
	
	it('Throws error if no storage provider is send.', (done) => {
		try{	
			var oAuth2 = require('../oAuth2Server')({});
		} catch(err) {
			should.exist(err);
			done();
		}
	});
		
	
});   