/**
 * Security Settings
 * (sails.config.security)
 *
 * These settings affect aspects of your app's security, such
 * as how it deals with cross-origin requests (CORS) and which
 * routes require a CSRF token to be included with the request.
 *
 * For an overview of how Sails handles security, see:
 * https://sailsjs.com/documentation/concepts/security
 *
 * For additional options and more information, see:
 * https://sailsjs.com/config/security
 */

module.exports.security = {

  /***************************************************************************
  *                                                                          *
  * CORS is like a more modern version of JSONP-- it allows your application *
  * to circumvent browsers' same-origin policy, so that the responses from   *
  * your Sails app hosted on one domain (e.g. example.com) can be received   *
  * in the client-side JavaScript code from a page you trust hosted on _some *
  * other_ domain (e.g. trustedsite.net).                                    *
  *                                                                          *
  * For additional options and more information, see:                        *
  * https://sailsjs.com/docs/concepts/security/cors                          *
  *                                                                          *
  ***************************************************************************/

  // cors: {
  //   allRoutes: false,
  //   allowOrigins: '*',
  //   allowCredentials: false,
  // },

  cors: {
    allRoutes: true,
    allowOrigins: [
      // ISY_BASE_URL,
      'https://localhost:4200',
      'http://localhost:4200',
      'https://10.0.9.14:4200',
      'http://10.0.9.14:4200',
      'https://help-on-spot.de',
      'http://help-on-spot.de'
    ],
    allowCredentials: true
    // allowAnyOriginWithCredentialsUnsafe: true,
    // allowRequestMethods: 'GET,PUT,PATCH,POST,OPTIONS,HEAD',
    // allowRequestHeaders: 'content-type,credentials'
  }


  /****************************************************************************
  *                                                                           *
  * CSRF protection should be enabled for this application.                   *
  *                                                                           *
  * For more information, see:                                                *
  * https://sailsjs.com/docs/concepts/security/csrf                           *
  *                                                                           *
  ****************************************************************************/

  // csrf: true

};
