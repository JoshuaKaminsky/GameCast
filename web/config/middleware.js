var passport = require('passport')
	, bcrypt = require('bcrypt')
	, LocalStrategy = require('passport-local').Strategy;
    , FacebookStrategy = require('passport-facebook').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var loginHandler = function(username, password, done) {
	process.nextTick(function() { 
		User.findOne({ emailaddress: username }).done(function(err, user) {
			if (err) {
				return done(err);
			}
			
			if (!user) {
				return done(null, false, {
					message: 'Unknown user ' + username
				});
			}
			
			bcrypt.compare(password, user.password, function(err, match) {
				if (err || !match) {
					return done(null, false, {
						message: 'Invalid password'
					});
				}				
				return done(null, user);
			});			
		});
	});
};
	
var verifyHandler = function (token, tokenSecret, profile, done) {
    process.nextTick(function () {
		console.log('oauth response: %j', profile)
		
        User.findOne({emailaddress: profile.emailAddress}).done(function (err, user) {
			if (err || user) {
				return done(null, user);
			} else {
				User.create({ name: profile.displayName, emailaddress: profile.emailAddress, provider: profile.provider }).done(function (err, user) {
					return done(err, user);
				});
			}
		});
    });
};

passport.serializeUser(function (user, done) {
	console.log('serializeUser id: ' + user.id);
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	console.log('deserializeUser id: ' + id); 
    User.findOne({id: id}).done(function (err, user) {
        done(err, user)
    });
});

passport.use(new LocalStrategy(
	loginHandler
));

passport.use(new FacebookStrategy({
		clientID: "237217273141476",
		clientSecret: "a03c9e7e93407e3ab41a7f6e3838d49b",
		callbackURL: "http://localhost:1337/auth/facebook/callback"
	},
	verifyHandler
));

passport.use(new GoogleStrategy({
		clientID: '879176136570-ujh7uepkb8gpjhbp4ps5jrug02e2g2h8.apps.googleusercontent.com',
		clientSecret: 'iENYXdeAGGNMaIMuiE8P4Lig',
		callbackURL: 'http://localhost:1337/auth/google/callback'
	},
	verifyHandler
));

module.exports = {

    express: {
        customMiddleware: function (app) {    
			app.use(passport.initialize());
            app.use(passport.session());
        }
    }
};