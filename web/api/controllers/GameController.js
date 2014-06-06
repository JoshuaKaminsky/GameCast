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

	game : function (req, res) {
		// Request includes the game ID, let's find it.
		Game.findOne({
			'id' : req.param('id')
		}).done(function (err, game) {
			if (err) {
				return console.log(err)
			}

			// Found a game, what are its instances??
			GameInstance.find({
				gameId : game.id
			}).done(function (err, gameInstances) {
				if (err) {
					return console.log(err)
				}

				for (var gameInstanceIndex = 0; gameInstanceIndex < gameInstances.length; gameInstanceIndex++) {
					var gameInstance = gameInstances[gameInstanceIndex];
					gameInstance.playerNames = [];

					User.find({
						'id' : gameInstance.playerIds
					}).done(function (err, players) {
						if (err) {
							return console.log(err);
						}

						console.log('players : %j', players);

						for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
							var player = players[playerIndex];

							if (!player) {
								console.log("Can't find user for id: %s", players[playerIndex])
								return res.send(201);
							}

							gameInstance.playerNames.push(player.name);
						}

						console.log('gameInstance %j', gameInstances);

						return res.view({
							'game' : game,
							'gameInstances' : gameInstances
						});
					});
				}
			});

		});
	},

	/**
	 * Overrides for the settings in `config/controllers.js`
	 * (specific to GameController)
	 */
	_config : {}

};
