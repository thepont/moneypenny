module.exports = function(storageProvider){
    var userStore = storageProvider.userStore;
    return {         
        /**
        * Gets the user from the express request
        * @return {User} user found in the express request.
        */
        fetchFromRequest: (req) => {
            return req.user;
        },
        
        /**
        * Returns the user found inthe database.
        */
        fetchById: (id, cb) => { 
            userStore.fetchById(id)
                .then(user => cb(null, user))
                .catch(err => cb(err));
        },
        
        /**
        * Gets the user id from the user object.
        * @return {ObjectID} user id in the user object
        */
        getId: (user) => {
            return user._id;
        }
    };
};
