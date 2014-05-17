/**
 * AuthController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport');

module.exports = {

	register: function (req, res) {
        res.view();
    },

    login: function (req, res) {
        res.view();
    },

    logout: function (req, res) {
        req.logout();
        res.redirect('/');
    },

	internalRegister: function( req, res) {
		//check if user email is unique
		User.findOne({ email: request.body.emailAddress }).done(function (err, user) {
			if (err) response.json({ error: 'email already exists' }, 400);
		});
		
		//get password hash and salt
		var bcrypt = require('bcrypt');

		bcrypt.genSalt(10, function(err, salt) {
			if (err) response.json({ error: 'Server error' }, 500);

			if(salt) {
				bcrypt.hash(request.body.password, salt, function(err, hash) {
					if (err) response.json({ error: 'Server error' }, 500);

					if(hash) {
						var user = {
							name: request.body.name,
							email: request.body.emailAddress,
							passwordHash: hash,
							salt: salt
						};
						
						User.create(user);
						
						return response.redirect('/login');
					};
				});
			};
		});
	},
	
	internalLogin: function( req, res) {
		var bcrypt = require('bcrypt');

		User.findOne({ name: request.body.name }).done(function (err, user) {
			if (err) response.json({ error: 'DB error' }, 500);

			if (user) {
				
				bcrypt.hash(request.body.password, user.salt, function(err, hash) {
					if (err) response.json({ error: 'Server error' }, 500);
				
					if(hash) {
						bcrypt.compare(hash, user.password, function (err, match) {
						  if (err) response.json({ error: 'Server error' }, 500);

						  if (match) {
							request.session.user = user.id;
							response.json(user);
						  } else {
							if (request.session.user) {
								request.session.user = null;
							}
							
							response.json({ error: 'Invalid password' }, 400);
						  }
						});
					};
				});
				
			} else {
				response.json({ error: 'User not found' }, 404);
			}
		});
	},
    // http://developer.github.com/v3/
    // http://developer.github.com/v3/oauth/#scopes
    github: function (req, res) {
        passport.authenticate('github', { failureRedirect: '/login' },
            function (err, user) {
                req.logIn(user, function (err) {
                    if (err) {
                        console.log(err);
                        res.view('500');
                        return;
                    }

                    res.redirect('/');
                    return;
                });
            })(req, res);
    },

    // https://developers.facebook.com/docs/
    // https://developers.facebook.com/docs/reference/login/
    facebook: function (req, res) {
        passport.authenticate('facebook', { failureRedirect: '/login', scope: ['email'] },
            function (err, user) {
                req.logIn(user, function (err) {
                    if (err) {
                        console.log(err);
                        res.view('500');
                        return;
                    }

                    res.redirect('/');
                    return;
                });
            })(req, res);
    },

    // https://developers.google.com/
    // https://developers.google.com/accounts/docs/OAuth2Login#scope-param
    google: function (req, res) {
        passport.authenticate('google', { failureRedirect: '/login', scope:['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email'] },
            function (err, user) {
                req.logIn(user, function (err) {
                    if (err) {
                        console.log(err);
                        res.view('500');
                        return;
                    }

                    res.redirect('/');
                    return;
                });
            })(req, res);
    },


    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to AuthController)
    */
    _config: {}


};