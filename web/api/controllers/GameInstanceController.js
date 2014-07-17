/**
 * GameInstanceController
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
    
  newGameInstance : function(request, response) {
    var name = request.body.name;
    var isPublic = request.body.isPublic;
    var gameId = request.body.gameId;
    var user = request.user;

    GameInstance.create({ name: name, isPublic: isPublic, status: 'pending', gameId: gameId, ownerId: user.id, playerIds: [ user.id ]})
      .done(function(error, game) {
        if(error) {
          console.log(error);
          return response.json(error, 500);
        }

        return response.json(game, 200);        
      })
  },

  'addPlayer' : function(req, res) {
  	var gameInstanceId = req.param('gameInstanceId')
  	var playerId = req.session.passport.user.id
  	GameInstance.findOne( { 'id' : gameInstanceId } ).done(
  		function(err, gameInstance) {
  			if (err) {
  				return console.log("fuck you gameInstanceController")
  			}

  			console.log("gameInstance = %j", gameInstance)

  			// update its players
  			if (!gameInstance.playerIds) {
  				gameInstance.playerIds = [ ]
  			}

  			gameInstance.playerIds.push(playerId);

  			gameInstance.save(function(err) {
  				if (err) {
  					return console.log("Can't update gameInstance: %s", err)
  				} else {
  					return res.send(200)
  				}
  			})

  		})
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to GameInstanceController)
   */
  _config: {}

  
};
