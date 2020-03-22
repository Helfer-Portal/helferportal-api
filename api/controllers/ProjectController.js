const SailsEmber = require('sails-ember-rest');
/**
 * ProjectController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const controller = new SailsEmber.controller({
  create(req, res) {
    console.log(
      'CREATE project param',
      req.param('project')
    );
    return SailsEmber.actions.create()(req, res);
  }
});

module.exports = controller;
