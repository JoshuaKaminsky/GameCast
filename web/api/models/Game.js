module.exports = {

  attributes : {
    
	name: {
		type: 'string',
		required: true
	},

	description: {
		type: 'string',
		required: true
	},

	minPlayers: {
		type: 'integer',
		required: true
	},

	maxPlayers: {
		type: 'integer',
		required: true
	},

	imageUrl: {
		type: 'string',
		required: true
	},
	
  }
  
};
