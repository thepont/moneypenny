// var should = require('should');
// var proxyquire = require('proxyquire');
// var sinon = require('sinon');


// var oAuth2Server = {
// 	controller:{
// 		authorization : sinon.stub(),
// 		token : sinon.stub(),
// 	}
// }
// var oAuthServerRoutes = proxyquire('../oauth-server--routes', {
// 	'moneypenny-server/auth/oauth-server/oAuth2Server' : oAuth2Server
// })

// describe('oauth-server--routes', () => {   
// 	describe('/oauth2/authorization', () => {
// 		describe('GET', () => { 
// 			it('Calls oAuth2Server authorization method', () => {
// 				oAuthServerRoutes['/oauth2/authorization'].get();
// 				oAuth2Server.controller.authorization.calledOnce.should.be.true();
// 			});
// 		});
// 	});
	
// 	describe('/oauth2/token', () => {
// 		describe('POST', () => { 
// 			it('Calls oAuth2Server token method', () => {
// 				oAuthServerRoutes['/oauth2/token'].post();
// 				oAuth2Server.controller.token.calledOnce.should.be.true();
// 			});
// 		});
// 	});
// });