/**
 * GameController
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

module.exports = {

	newGame : function(request, response) {
		var name = req.param('name');
		var description = req.param('description');
		var minPlayers = req.param('minPlayers');
		var maxPlayers = req.param('maxPlayers');
		var imageUrl = req.param('imageUrl');

		Game.create({ name: name, description: description, minPlayers: minPlayers, maxPlayers: maxPlayers, imageUrl: imageUrl })
			.done(function(error, game) {
				if(error) {
					console.log(error);
				}


			})
	},

	game : function (request, response) {
		Game.findOne({'id' : request.param('id')})
			.then(function (game) {
				GameInstance.find({ gameId: game.id }).then(function(gameInstances){
					return response.view({ game: game, gameInstances: gameInstances });					
				});
			});
	},

	/**
	 * Overrides for the settings in `config/controllers.js`
	 * (specific to GameController)
	 */
	_config : {}

};
