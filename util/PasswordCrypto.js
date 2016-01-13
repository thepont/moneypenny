var bcrypt = require('bcrypt');

var SALT_WORK_FACTOR = 10;

var PasswordCrypto = {
    checkPassword : function(password, hash){
        return new Promise(function(resolve, reject){
            bcrypt.compare(password, hash, function(err, res) {
                if ( res === true )
                {
                    return resolve(password);
                } else {
                    return reject(err);
                }
            });
        });
    },
    createHash : function(password){
        return new Promise(function(resolve, reject){
            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                if(err) return reject();
                bcrypt.hash(password, salt, function(err, hash){
                   if(err) return reject();
                   return resolve(hash); 
                });
            });
        });
    }
};

module.exports = PasswordCrypto;
