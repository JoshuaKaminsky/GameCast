/**
 * GameController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
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

module.exports = {
    
   game: function(req, res) {
       // Request includes the game ID, let's find it.
       var game = Game.findOne( { 'id': req.param('id') }).done(
       	    function(err, game) {
       	    	if (err) {
       	    		return console.log(err)
       	    	}
       	    	console.log("Got game: %j", game)
       	    	// Found a game, what are its instances??
       	    	GameInstance.find({ gameId : game.id}).done(
       	    		function(err, gameInstances) {
       	    			if (err) {
       	    				return console.log(err)
       	    			}
       	    			console.log("Return gameInstances: %j", gameInstances)
		       	    	return res.view( { 'game': game, 'gameInstances': gameInstances })
		       	    }
       	    	)
       	    }
       	)
   },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to GameController)
   */
  _config: {}

  
};
