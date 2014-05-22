module.exports = {

	// Lifecycle Callbacks
	beforeCreate: function(values, next) {
	  next();
	},

	attributes : {
	
		emailaddress: {
			type: 'email',
			required: true
		},
	
		name: {
			type: 'string',
			required: true
		},

		password: {
			type: 'string'
		},
	
		salt: {
			type: 'string'
		},

		provider : {
			type: 'string',
			required: true
		}
	}  
};
