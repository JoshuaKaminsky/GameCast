/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {

  'use strict';
 
	// Sockets
	if(req.isSocket)
	{
		if(req.session &&
		req.session.passport &&
		req.session.passport.user)
		{
			return ok();
		}
 
		res.json(401);
	}
	// HTTP
	else
	{
		if(req.isAuthenticated())
		{
			return ok();
		}
		
		res.redirect('/login');
	}
};