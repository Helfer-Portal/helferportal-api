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
      required: true,
      description: 'aktive ja/nein?',
      example: 'true = offen, false = closed.'
    },

    coordinator: {
      type: 'string',
      required: true,
      description: 'Wer hat die Verantwortung',
      example: 'Karl Ganz'
    },

    description: {
      type: 'string',
      required: true,
    },

    positiveResponses: {
      type: 'number',
      required: true,
      description: 'Wieviele Personen haben sich positiv zurück gemeldet',
      example: '44'
    },

    activeHelpers: {
      type: 'number',
      required: true,
      description: 'Personen am Einsatz Ort',
      example: '22'
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

