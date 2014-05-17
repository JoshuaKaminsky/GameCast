module.exports = {

	beforeCreate: function (attributes, next) {
		
	  },

  attributes : {
    
	name: {
		  type: 'string',
		  required: true
    },

	password: {
		  type: 'string',
		  required: true,
		  minLength: 6
    },
	
	salt: {
		type: 'string',
		required: true
	}
	
	/*emailAddress: {
		type: 'email',
		required: true
	}*/
	
  }
  
};
