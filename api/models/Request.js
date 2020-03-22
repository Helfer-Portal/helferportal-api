/**
 * Request.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    status: {
      type: 'boolean',
      description: 'aktive ja/nein?',
      example: 'true = offen, false = closed.'
    },

    coordinator: {
      type: 'string',
      description: 'Wer hat die Verantwortung',
      example: 'Karl Ganz'
    },

    description: {
      type: 'string',
    },

    positiveResponses: {
      type: 'number',
      description: 'Wieviele Personen haben sich positiv zurück gemeldet',
      example: '44'
    },

    activeHelpers: {
      type: 'number',
      description: 'Personen am Einsatz Ort',
      example: '22'
    },

    start: {
      type: 'string',
      columnType: 'timestamp',
    },

    end: {
      type: 'string',
      columnType: 'timestamp',
    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    address: {
      model: 'address'
    },

    organisation: {
      model: 'Organisation'
    },

    qualities: {
      collection: 'quality',
      via: 'owningRequests'
    },

    registrations: {
      collection: 'user',
      via: 'participation'
    }
  },

};

