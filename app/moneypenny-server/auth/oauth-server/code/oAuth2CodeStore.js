var jwt = require('jsonwebtoken');
var logger = require('../../../util/logger');

module.exports = function(storageProvider, secret){
    var codeStore = storageProvider.codeStore;
    return {
        getUserId: function(code){
            return code.userId;
        },
        getClientId: function(code){
            return code.clientId;
        },
        getScope: function(code){
            return code.scope;
        },
        checkTTL: function(code){
            try{
                jwt.verify(code.code,secret);
                return true;
            } catch (err){
                return false;
            }
        },
        create: function(userId, clientId, scope, ttl, cb){
            var oauth2Code = {
                userId: userId,
                clientId: clientId,
                scope: scope,
                ttl: ttl
            }
            return new Promise((resolve, reject)=>{
                var code = jwt.sign(oauth2Code, secret, { expiresInSeconds: ttl, ignoreExpiration: false});
                oauth2Code.code = code;
                return codeStore.save(oauth2Code).then(() => {
                    return resolve(code);
                }).catch(err =>{
                    return reject(err);
                })
            }).then(code =>{
                return cb(null, code);
            }).catch((err)=>{
                logger.error(err);
                return cb(err);
            });
        },
        fetchByCode : function(code, cb){
        codeStore.fetchByCode(code)
                .then(params => {
                    return cb(null, params);
                })
                .catch(err => {
                    logger.error(err);
                    return cb(err);
                });
        },
        removeByCode : function(code, cb){
            codeStore.removeByCode(code).then(()=>{
                cb(null);
            }).catch(err=>{
                cb(err);
            })
        }
    }
}
