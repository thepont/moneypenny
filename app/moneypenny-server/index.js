

const AUTHORIZATION_ENDPOINT =  '/oauth2/authorization';
const TOKEN_ENDPOINT = '/oauth2/token';

const ERROR_NO_USER = 'User logged in but no session user found in database';
const ERROR_SERIALIZING_USER = 'User logged in but unable to serialize into database';
const ERROR_NO_SESSION = 'No session found user will not be returned to the correct url';

const DEFAULT_REDIRECT = '/';


/**
 * @typedef {Object} Options
 * @property {String} redirectUrl default redirect url to use if no previous url is found.
 * @property {String} loginUrl url to redirect to for login.
 * @property {StorageProvider} storageProvider storage provider to use to store autentication details.
 */


/**
* Middlewere for checking that people using the service are authenticated.
* 
* Adds req.sesson.returnTo, the url to redirect the user to after login.
* 
* @param {request} req express request to check authenticated
* @param {response} res express response related to this request
* @param {function()} next callback to next middleware to handle request.
*/

var ensureAuthenticated = (options) => (req, res, next) => {
	if(req.isAuthenticated()){
		return next(null);
	}
	if(req.originalUrl && req.session){
		req.session.returnTo = req.originalUrl;
	}
	res.redirect(options.loginUrl);
};

/**
 * Create a moneypenny
 * @param {Options} options options to configure moneypenny with.
 * @returns {MoneyPenny} moneypenny service.
 */

module.exports = (options) => {
	var oAuth2Server = require('moneypenny-server/auth/oauth-server/oAuth2Server')(options);
	var logger = require('./util/logger');
	var redirectUrl = options.redirectUrl || DEFAULT_REDIRECT;
	
	return {
		
		/**
		 * Initalize moneypenny.
		 * adds oauth authentication endpoints to express app
		 * @param expressapp app the express app that this will run on.
		 */
		
		initialize: (app) => {
			app.use(oAuth2Server.inject());
			app.use(TOKEN_ENDPOINT, oAuth2Server.controller.token);
			app.use(ensureAuthenticated(options));
			app.use(AUTHORIZATION_ENDPOINT, oAuth2Server.controller.authorization);
		},
		
		/**
		 * Used for passport to serialize the session user.
		 * using this method will allow the oauth server to send whatever details are in the user object serialized.
		 * 
		 * @see http://passportjs.org/docs/configure#sessions
		 * 
		 * @example
		 * passport.serializeUser(authServer.serializeUser);
		 * 
		 * @example
		 * passport.serializeUser((user, done)=>{
		 *		//remove password from user.
		 * 		user.password = ''
		 *  	return authServer.serializeUser(user, done);
		 * })
		 */
		
		serializeUser: (user, done) =>{
			options.storageProvider.userStore.save(user).then(user => {
				done(null, user._id);
			}).catch(err => {
				logger.error(ERROR_SERIALIZING_USER);
				done(err, null);
			});
		},
		
		/**
		 * Used for passport to deserialize the session user.
		 * 
		 * @example
		 * passport.deserializeUser(authServer.deserializeUser);
		 */
		
		deserializeUser: (id, done) => {
			options.storageProvider.userStore.fetchById(id).then(user => {
				if(user)
				{
					done(null, user);
				}
				else
				{
					logger.error(ERROR_NO_USER, id);
					done(ERROR_NO_USER, null);
				}
			}).catch(err => {
				logger.error(err, id);
				done(err, null);
			});
			
		},
		
		/**
		 * Middlewere for checking that people using the service are authenticated.
		 * 
		 * Adds req.sesson.returnTo, the url to redirect the user to after login.
		 * 
		 * @param {request} req express request to check authenticated
		 * @param {response} res express response related to this request
		 * @param {function} next callback to next middleware to handle request.
		 */
		
		ensureAuthenticated: ensureAuthenticated(options),
		 
		/**
		 * Helper method for login, this method can be used once a login is established from a passport strategy
		 * 
		 * It will redirect the users back to the approprate location
		 * 
		 * @param {request} req express request to check authenticated
		 * @param {response} res express response related to this request
		 * @param {function} next callback to next middleware to handle request.
		 */
		
		loginAndRedirect: (req,res,next) => {
            if( req.session && req.session.returnTo ){
                return res.redirect(req.session.returnTo);
            }
            return res.redirect(redirectUrl);         
        } 
	};
};