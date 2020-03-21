/**
 * Organisation.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    name: {
      type: 'string',
      required: true,
      description: 'name of the quality',
      example: 'DRK Bottrop '
    },

    description: {
      type: 'string',
      required: true,
      description: 'Wer ist die Organisation',
      example: 'Ihr helfer in der Not mit ....'
    },

    logo: {
      type: 'string',
      required: true,
      description: 'Wer ist die Organisation',
      example: 'Ihr helfer in der Not mit ....'
    },

    type: {
      type: 'number',
      required: true,
      description: '1: skills, 2: handicaps, 3: tools',
      protect: true,
      example: '1'
    },

    phone: {
      type: 'string',
      required: true,
    },

    email: {
      type: 'string',
      required: true,
    },

    start: {
      type: 'string',
      columnType: 'datetime',
      required: true,
    },

    end: {
      type: 'string',
      columnType: 'datetime',
      required: true,
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

    projects: {
      collection:'project',
      via: 'organisation'
    }
  },

};

