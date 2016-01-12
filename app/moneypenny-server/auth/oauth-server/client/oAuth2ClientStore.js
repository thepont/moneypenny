var PasswordCrypto = require('../../../util/PasswordCrypto');
var logger = require('../../../util/logger');

const ERROR_CLIENT_CHECK_SECRET = 'Checking client secret failed';


module.exports = function(storageProvider){
	var clientStore = storageProvider.clientStore;

	return{
		getId: function(client){
			return client.id;
		},
		getRedirectUri: function(client){
			return client.redirectUri;
		},
		fetchById : function(clientId, cb){
			clientStore.fetchById(clientId).then((client) => {
				return cb(null, client);
			}).catch((err)=>{
				return cb(err, null);
			});
		},
		checkSecret : function(client, secret, cb){
			//check hash against secret, see if it looks correct.
			PasswordCrypto.checkPassword(secret, client.secret).then(()=>{
			return cb(null, true);
			}).catch((err)=>{
			logger.error(ERROR_CLIENT_CHECK_SECRET, client, err)
			return cb(null, false);
			})
		}
	}
}
