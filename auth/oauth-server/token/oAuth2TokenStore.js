module.exports = function(storageProvider, secret){	

	var crypto = require('crypto');
	var jwt = require('jsonwebtoken');
	
	var userStore = storageProvider.userStore;
	var tokenStore = storageProvider.tokenStore;
	
	function createAccessToken(user, userId, clientId, scope, ttl){
		return new Promise((resolve, reject)=>{
			var token = jwt.sign(user, secret, {expiresIn : ttl});
			var accessToken = {
				token: token,
				userId: userId,
				clientId: clientId,
				scope: scope,
				expiresAt : new Date((new Date()).getTime() + ttl)
			};
			return resolve(accessToken);
		});
	}

	return{
		getToken : function(accessToken){
			return accessToken.token;
		},
		create: function(userId, clientId, scope, ttl, cb){
			console.log('Create Called For Token', userId, clientId);
			userStore.fetchById(userId).then(user => {
				return createAccessToken(user, userId,clientId, scope, ttl).then((accessToken)=>{
					return tokenStore.save(accessToken).then(()=>{
						return cb(null, accessToken.token);
					});
				});
			}).catch(err => {
				return cb(err);
			});
		},
		fetchByToken : function(token, callback){
			tokenStore.fetchByToken(token).then((tokenObj) => {
				return callback(null, tokenObj);
			}).catch((err)=>{
				return callback(err);
			});
		},
		checkTTL : function(accessToken){
			try{
				jwt.verify(accessToken.token,secret);
				return true;
			} catch (err){
				return false;
			}
		},
		getTTL : function(token, cb){
			return  token.expiresAt - (new Date()).getTime();
		},
		fetchByUserIdClientId : function(userId, clientId, cb){
	
			tokenStore.fetchByUserIdClientId(userId, clientId).then((accessToken) => {
				return cb(null, accessToken);
			}).catch((err) =>{
				return cb(err);
			});
		}
	}
}
