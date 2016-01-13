var crypto = require('crypto');
var logger = require('moneypenny-server/util/logger');

module.exports = function(storageProvider){
	var refreshTokenStore = storageProvider.refreshTokenStore;
    
    return {
        /**
        *Given the oAuthToken returns the userID.
        *
        *@param <String> oAuthToken - refresh token to look up.
        *@returns <String> userId
        */
    
        getUserId: function(refreshToken){
            return refreshToken.userId;
        },
        /**
        * Given a oAuthToken returns the client id associated.
        * @param <String> oAuthToken - refresh token to look up.
        * @returns <String> client id - of the client that requested it
        */ 
        getClientId: function(refreshToken){
            return refreshToken.clientId;
        },
        
        getScope: function(refreshToken) {
            return refreshToken.scope;
        },
    
        create: function(userId, clientId, scope, cb) {
            var token = crypto.randomBytes(64).toString('hex');
            
            var refreshToken = {
                token: token,
                userId: userId,
                clientId: clientId,
                scope: scope
            }
            
            refreshTokenStore.save(refreshToken)
                .then(() => cb(null, token))
                .catch((err) => cb(err));
        },
        fetchByToken: function(token, cb){
            refreshTokenStore.fetchByToken(token)
                .then((refreshToken) => cb(null, refreshToken))
                .catch((err) => cb(err))
        },
        removeByUserIdClientId: function(userId, clientId, cb) {
            refreshTokenStore.removeByUserIdClientId(userId, clientId)
                .then(() => cb(null))
                .catch((err) => cb(err));
        },
        removeByRefreshToken: function(token, cb) {
            refreshTokenStore.removeByRefreshToken(token)
                .then(() => cb(null))
                .catch((err)=> cb(err));
        }
    }
}

