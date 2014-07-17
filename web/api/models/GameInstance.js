module.exports = {

    attributes: {

        gameId: {
            type: 'string',
            required: true
        },

        playerIds: {
            type: 'array',
        },

        ownerId: {
            type: 'string',
            required: true
        },

        name: {
            type: 'string',
            required: true
        },

        status: {
            type: 'string',
            required: true
        },

        gameStateKey: 'string'

    }

};
