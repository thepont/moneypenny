var OAuth2Lib = require('oauth20-provider');
var oauth2 = new OAuth2Lib({log: {level: 2}});

const ERR_NO_STORAGE_PROVIDER = "No storage supplyer option supplied";

var passport = require('passport');

var logger = require('winston');

/**
 * Provides methods for handing oAuth2.
 * 
 * @param {Options} options options to instansiate oAuth with
 * @throws {Error} when no storage provider is specified in options.
 */

module.exports = function(options){
    if( !options.storageProvider )
    {
        throw new Error(ERR_NO_STORAGE_PROVIDER);
    }
    
    var oAuth2RefreshTokenStore = require('moneypenny-server/auth/oauth-server/refresh-token/oAuth2RefreshTokenStore')(options.storageProvider);
    var oAuth2TokenStore = require('moneypenny-server/auth/oauth-server/token/oAuth2TokenStore')(options.storageProvider, 'secret');
    var oAuth2ClientStore = require('moneypenny-server/auth/oauth-server/client/oAuth2ClientStore')(options.storageProvider);
    var oAuth2UserStore = require('moneypenny-server/auth/oauth-server/user/oAuth2UserStore')(options.storageProvider);
    var oAuth2CodeStore = require('moneypenny-server/auth/oauth-server/code/oAuth2CodeStore')(options.storageProvider, 'secret');
    
    logger.level = 'debug';
    oauth2.logger = logger;
    
    //Client
    oauth2.model.client.getId = oAuth2ClientStore.getId;
    oauth2.model.client.getRedirectUri = oAuth2ClientStore.getRedirectUri;
    oauth2.model.client.fetchById = oAuth2ClientStore.fetchById;
    oauth2.model.client.checkSecret = oAuth2ClientStore.checkSecret; 
    
    // Refresh token
    oauth2.model.refreshToken.getUserId = oAuth2RefreshTokenStore.getUserId;
    oauth2.model.refreshToken.getClientId = oAuth2RefreshTokenStore.getClientId;
    oauth2.model.refreshToken.getScope = oAuth2RefreshTokenStore.getScope;
    oauth2.model.refreshToken.fetchByToken = oAuth2RefreshTokenStore.fetchByToken;
    oauth2.model.refreshToken.removeByUserIdClientId = oAuth2RefreshTokenStore.removeByUserIdClientId;
    oauth2.model.refreshToken.removeByRefreshToken = oAuth2RefreshTokenStore.removeByRefreshToken;
    oauth2.model.refreshToken.create = oAuth2RefreshTokenStore.create;
    
    // Access token
    oauth2.model.accessToken.getToken = oAuth2TokenStore.getToken;
    oauth2.model.accessToken.fetchByToken = oAuth2TokenStore.fetchByToken;
    oauth2.model.accessToken.checkTTL = oAuth2TokenStore.checkTTL;
    oauth2.model.accessToken.getTTL = oAuth2TokenStore.getTTL;
    oauth2.model.accessToken.fetchByUserIdClientId = oAuth2TokenStore.fetchByUserIdClientId;
    oauth2.model.accessToken.create = oAuth2TokenStore.create;
    
    //User
    oauth2.model.user.fetchFromRequest = oAuth2UserStore.fetchFromRequest;
    //oauth2.model.user.fetchById = oAuth2UserStore.fetchById;
    oauth2.model.user.getId = oAuth2UserStore.getId;
    
    
    //Code
    oauth2.model.code.create = oAuth2CodeStore.create;
    oauth2.model.code.fetchByCode = oAuth2CodeStore.fetchByCode;
    oauth2.model.code.removeByCode = oAuth2CodeStore.removeByCode;
    oauth2.model.code.getUserId = oAuth2CodeStore.getUserId;
    oauth2.model.code.getClientId = oAuth2CodeStore.getClientId;
    oauth2.model.code.getScope = oAuth2CodeStore.getScope;
    oauth2.model.code.checkTTL = oAuth2CodeStore.checkTTL;
    
    //Decisions, don't make them.
    oauth2.decision = function(req, res, client, scope, user){
        req.body.decision = 1;
        req.method = 'POST';
        return oauth2.controller.authorization(req, res);
    };
    
    return oauth2;
}
