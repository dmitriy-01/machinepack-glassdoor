module.exports = {


  friendlyName: 'Get company',


  description: 'Get company information',


  extendedDescription: '',


  inputs: {
    partnerId: {
      example: '5317',
      description: 'Your partner id, as assigned by Glassdoor',
      required: true
    },
    partnerKey: {
      example: 'n07aR34Lk3Y',
      description: 'Your partner key, as assigned by Glassdoor',
      required: true
    },
    userIp: {
      example: '0.0.0.0',
      description: 'The IP address of the end user to whom the API results will be shown',
      required: true
    },
    userAgent: {
      example: '',
      description: 'The User-Agent (browser) of the end user to whom the API results will be shown. Note that you can can obtain this from the "User-Agent" HTTP request header from the end-user',
      required: true
    },
    q: {
      example: 'Microsoft',
      description: 'Query phrase to search for - can be any combination of employer or occupation, but location should be in l param.',
      required: true
    },
    l: {
      example: 'Albuquerque, NM, United States',
      description: 'Scope the search to a specific location by specifying it here - city, state, or country.'
    }
  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.'
    },

    success: {
      description: 'Done.'
    }

  },


  fn: function (inputs, exits) {
    //var URL = require('url');
    //var QS = require('querystring');
    //var _ = require('lodash');
    var Http = require('machinepack-http');
    var _ = require('underscore');

    Http.sendHttpRequest({
      baseUrl: 'http://api.glassdoor.com/api/api.htm?format=json&v=1&action=employers'
      + '&t.p=' + inputs.partnerId
      + '&t.k=' + inputs.partnerKey
      + '&userip=' + inputs.userIp
      + '&useragent=' + inputs.userAgent
      + '&q=' + inputs.q
      + '&l=' + inputs.l,
      url: '',
      method: 'get'
    }).exec({
      // OK.
      success: function (result) {

        try {
          var responseBody = JSON.parse(result.body);
        } catch (e) {
          return exits.error('An error occurred while parsing the body.');
        }

        if (!responseBody.success) {
          return exits.error('API call failed');
        }
        if (!responseBody.response || !responseBody.response.employers) {
          return exits.error('No companies found');
        }

        _.each(responseBody.response.employers, function (employer, index) {
          if (employer.exactMatch == true) {
            return exits.success(employer);
          }
          if (index + 1 == responseBody.response.employers.length) {
            return exits.error('No exact match');
          }
        });

      },
      // Non-2xx status code returned from server
      notOk: function (result) {

        try {
          if (result.status === 403) {
            return exits.error("Invalid or unprovided API key. All calls must have a key.");
          }
        } catch (e) {
          return exits.error(e);
        }

      },
      // An unexpected error occurred.
      error: function (err) {

        exits.error(err);
      }
    });
  }


};
