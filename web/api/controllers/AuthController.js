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

	register: function (req, response) {
        response.view();
    },

    login: function (req, response) {
        response.view();
    },

    logout: function (request, response) {
        request.logout();
        response.redirect('/');
    },

	registerCallback: function( request, response) {
		//validate inputs
		if(!request.body.name) {
			return response.json({ error: 'name is required' }, 400);
		}
		
		if(!request.body.emailAddress) {
			return response.json({ error: 'email is required' }, 400);
		}
		
		if(!request.body.password || !request.body.passwordConfirmation) {
			return response.json({ error: 'password is required' }, 400);
		}
		
		if(request.body.password != request.body.passwordConfirmation) {
			return response.json({ error: 'password confirmation does not match password' }, 400);
		}
		
		//check if user email is unique
		User.findOne({ email: request.body.emailAddress }).done(function (err, user) {
			if (err) return response.json({ error: 'email already exists' }, 400);
		});
		
		//get password hash and salt
		var bcrypt = require('bcrypt');

		bcrypt.genSalt(10, function(err, salt) {
			if (err) return response.json({ error: 'Server error' }, 500);

			if(salt) {
				bcrypt.hash(request.body.password, salt, function(err, hash) {
					if (err) response.json({ error: 'Server error' }, 500);

					if(hash) {
						var user = {
							name: request.body.name,
							emailaddress: request.body.emailAddress,
							password: hash,
							salt: salt
						};
						
						User.create(user).done(function (err, user) {
							if (err) {
								console.log(err);
								response.view('500');
								return;
							}
							
							request.logIn(user, function (err) {
								if (err) {
									console.log(err);
									response.view('500');
									return;
								}

								response.redirect('/login');
								return;
							});
						});
						
						return response.redirect('/login');
					};
				});
			};
		});
	},
	
	loginCallback: function( request, response) {
		passport.authenticate('local', function(err, user, info) {
			if ((err) || (!user)) {
				response.redirect('/login');
				return;
			}
 
			request.logIn(user, function(err) {
				if (err) {
					response.view();
					return;
				}
 
				response.redirect('/');
				return;
			});
		})(request, response);		
	},
    
    // https://developers.facebook.com/docs/
    // https://developers.facebook.com/docs/reference/login/
    facebook: function (request, response) {
        passport.authenticate('facebook', { failureRedirect: '/login', scope: ['email'] },
            function (err, user) {
                request.logIn(user, function (err) {
                    if (err) {
                        console.log(err);
                        response.view('500');
                        return;
                    }

                    response.redirect('/');
                    return;
                });
            })(request, response);
    },

    // https://developers.google.com/
    // https://developers.google.com/accounts/docs/OAuth2Login#scope-param
    google: function (request, response) {
        passport.authenticate('google', { failureRedirect: '/login', scope:['https://www.googleapis.com/auth/userinfo.email'] },
            function (err, user) {
                request.logIn(user, function (err) {
                    if (err) {
                        console.log(err);
                        response.view('500');
                        return;
                    }

                    response.redirect('/');
                    return;
                });
            })(request, response);
    },
	
    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to AuthController)
    */
    _config: {}


};