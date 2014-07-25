$(function() {

	var options = {
	  valueNames: [ 'gameInstanceName', 'gameInstancePlayer', 'gameInstanceOwner' ]
	};

	var gameInstanceList = new List('gameInstances', options);


	$('#newGameBtn').click(function() {
		var name = $('#newGameName').val();
		var isPublic = $('#newGameIsPublic').is(':checked');

		var gameId = $('#gameId').val();

		$.post('/newGame', { name: name, isPublic: isPublic, gameId: gameId })
			.done(function(game) {
				if(game) {
					gameInstanceList.add(game);
				}
			});
	});

	$('.join-button').click(function(event) {
		var target = $(event.target)
		target.hide()

		var gameInstanceId = target.data("gameinstanceid")
		$.post('/gameInstance/addPlayer', { gameInstanceId: gameInstanceId })
			.done(function(player) {
				if(player) {
					var parent = target.parent;
				}
			})
			.fail(function(error) {

			});
	});
});