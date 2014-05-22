var passport = require('passport')
	, bcrypt = require('bcrypt')
	, LocalStrategy = require('passport-local').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var loginHandler = function(username, password, done) {
	process.nextTick(function() { 
		console.log(username);
		console.log(password);
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
		
		if(!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
			return done(null, null);
		}
		var emailAddress = profile.emails[0].value;
		
        User.findOne({emailaddress: emailAddress}).done(function (err, user) {
			if (err || user) {
				return done(null, user);
			} else {
				User.create({ name: profile.displayName, emailaddress: emailAddress, provider: profile.provider }).done(function (err, user) {
					return done(err, user);
				});
			}
		});
    });
};

passport.serializeUser(function (user, done) {
	console.log('serializeUser user: %j', user);
    done(null, { id: user.id, name: user.name} );
});

passport.deserializeUser(function (data, done) {
	console.log('deserializeUser user: %j', data); 
    User.findOne({id: data.id}).done(function (err, user) {			
        done(null, user);
    });
});

module.exports = {

    express: {
        customMiddleware: function (app) {    
		
			passport.use(new LocalStrategy({
					usernameField: 'emailAddress',
					passwordField: 'password'
				},
				loginHandler
			));

			passport.use(new FacebookStrategy({
					clientID: "237217273141476",
					clientSecret: "a03c9e7e93407e3ab41a7f6e3838d49b",
					callbackURL: "http://localhost:1337/auth/facebook/callback"
					//callbackURL: "http://gamecast.herokuapp.com/auth/facebook/callback"
				},
				verifyHandler
			));

			passport.use(new GoogleStrategy({
					clientID: '879176136570-ujh7uepkb8gpjhbp4ps5jrug02e2g2h8.apps.googleusercontent.com',
					clientSecret: 'iENYXdeAGGNMaIMuiE8P4Lig',
					callbackURL: "http://localhost:1337/auth/google/callback"
					//callbackURL: 'http://gamecast.herokuapp.com/auth/google/callback'
				},
				verifyHandler
			));

			app.use(passport.initialize());
            app.use(passport.session());
        }
    }
};