var passport = require('passport');
var jwt = require('jsonwebtoken');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var LocalAPIKeyStrategy = require('passport-localapikey').Strategy;
var shortid = require('shortid');
var util = require('util');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var users = {};

var PROVIDER_NAME = 'auth-server';

var CALLBACK_URL = '/auth/provider/callback';

var CLIENT_ID = 'oAuthTest';
var CLIENT_SECRET = 'production1';
var SERVER_PORT = 3334;
var SERVER_HOST = 'localhost';

var AUTH_PORT = 3000;
var AUTH_HOST = 'localhost'; 

/**
 * Setup routes required for oauth, login page and callback
 *
 * Money Penny
 */ 
var setupRoutes = function(app){
    app.get(CALLBACK_URL, passport.authenticate(PROVIDER_NAME, { failureRedirect: '/login'}), 
        function(req, res, next){
            return res.json(req.user);
        });
    app.get('/login', passport.authenticate(PROVIDER_NAME));
};

/**
 * Redirect user to login if they are yet to login
 */ 

var authenticated = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        if (!req.query.apikey){
            return res.redirect('/login');
        } else {
            return passport.authenticate(['localapikey'], { session: false })(req, res, next);
        }
    }
}

/**
 * Render user as JSON once logged in.
 *
 * Service Specific logic
 */

var showUserDetails = function(req, res, next){
    return res.json(req.user);
}
/*
 * Set up Passports Auth2Stratergy with correct details.
 *
 * MoneyPenny.
 */ 
passport.use(PROVIDER_NAME, 
        new OAuth2Strategy({
            authorizationURL: util.format('http://%s:%d/oauth2/authorization', AUTH_HOST, AUTH_PORT),
            callbackURL: util.format('http://%s:%d/auth/provider/callback', SERVER_HOST, SERVER_PORT),
            tokenURL: util.format('http://%s:%d/oauth2/token', AUTH_HOST, AUTH_PORT),
            clientID: CLIENT_ID,
            clientSecret : CLIENT_SECRET
        }, 
        function(accessToken, refreshToken, profile, done ){
            if(accessToken){
                // Verify the accessToken using JWT to extract user.
                console.log(accessToken);
                jwt.verify(accessToken, 'secret', function(err, user){
                    user.token = accessToken;
                    done(err, user);
                });
            } else {
                done(new Error('No access token returned from server'));
            }
    }
));

passport.use(new LocalAPIKeyStrategy(
            function(apikey, done){
                jwt.verify(apikey, 'secret', function(err, user){
                    user.token = apikey;
                    done(null, user);
                });
            }));

/**
 * Seralize user into memory.
 */
passport.serializeUser(function(user, done){
    try{
        done(null, user.token);
    }catch (err){
        done(err);
    }
});
/**
 * Deseralize user from memory.
 */
passport.deserializeUser(function(id, done){
    try{
        jwt.verify(id, 'secret', function(err, user){
            user.token = id;
            done(null, user);
        });
    }catch (err){
        done(err);
    }
});

var config = {
    server: {
        port: SERVER_PORT
    },
    httpsOnly: false,
    __dirname: __dirname,
    routes_root_path: __dirname + '/',
    services_root_path: __dirname + '/app/auth-server',
    static_root_path: __dirname + '/public',
    session: {
        store: new FileStore({}),
        saveUninitialized: true,
        resave: true,
        secret: 'session_secret'
    }
}
var elephas = require('elephas')(config);

elephas.createServer({
        beforeRoutes: function(done, app){
            app.use(passport.initialize());
            app.use(passport.session());
            //Add oauth routes
            setupRoutes(app);
            //Check that user is authenticated
            app.use(checkAuthenticated);
            //They are authenticated so just show their user details
            app.use(showUserDetails);
            //Log people out on error, it's possibly because sessions are stored in memory
            app.use(function(err, req, res, next) {
                console.error(err.stack);
                res.status(500).send(err);
            });
            done();
        }
});
