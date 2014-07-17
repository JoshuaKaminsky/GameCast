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
				var gameInstances = GameInstance.find({ gameId: game.id }).then(function(gameInstances){
					return gameInstances;						
				});

			// var userIds = gameInstances.map(function(instance){ return instance.playerIds; });

				// console.log('userIds: %j', userIds);

			// GameInstance.find({
			// 	gameId : game.id
			// }).then(function (err, gameInstances) {
			// 	for (var gameInstanceIndex = 0; gameInstanceIndex < gameInstances.length; gameInstanceIndex++) {
			// 		gameInstances[gameInstanceIndex].playerNames = User.find({'id' : gameInstance.playerIds})
			// 			.then(function (players) {
			// 				var playerNames = [];
			// 				for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
			// 					var player = players[playerIndex];

			// 					if (!player) {
			// 						console.log("Can't find user for id: %s", players[playerIndex])
			// 					} else {
			// 						playerNames.push(player.name);
			// 					}
			// 				}

			// 				return playerNames;
			// 			}).done();
			// 	}

				return [game, gameInstances];
				
			}).spread(function(game, gameInstances) {
				var playerIds = gameInstances.map(function(){ return this.playerIds ? this.playerIds.get() : []; });
				var filtered = playerIds.filter(function(id, index) { return playerIds.indexOf(id) === index; });

				console.log("game instances: %j", gameInstances);
				console.log("filtered player list: %j", filtered);


				return response.view({ game: game, gameInstances: gameInstances });
			}).fail(function(error){
				console.log(error);
			});
	},

	/**
	 * Overrides for the settings in `config/controllers.js`
	 * (specific to GameController)
	 */
	_config : {}

};
