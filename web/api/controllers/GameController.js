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
var _ = require('underscore-node');

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
					var uniqueIds= gameInstances.map(function(gameInstance) {return gameInstance.ownerId}).filter(function(item,index,array){
					    return index == array.indexOf(item);
					});

					User.find({'id': uniqueIds}).then(function(users) {
						for (var index = gameInstances.length - 1; index >= 0; index--) {
							var user = _.find(users, function(u) { return u.id == gameInstances[index].ownerId; });
							gameInstances[index].ownerName = (user) ? user.name : 'private'
						};

						return response.view({ game: game, gameInstances: gameInstances });	
					});									
				});
			});
	},

	/**
	 * Overrides for the settings in `config/controllers.js`
	 * (specific to GameController)
	 */
	_config : {}

};
