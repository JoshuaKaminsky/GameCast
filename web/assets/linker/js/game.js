$(function() {

	var options = {
	  valueNames: [ 'gameInstanceName', 'gameInstancePlayer' ]
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
});