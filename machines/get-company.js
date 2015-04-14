module.exports = {


  friendlyName: 'Get company',


  description: 'Get company information',


  extendedDescription: '',


  inputs: {


  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'Done.',
    },

  },


  fn: function (inputs,exits
  /**/) {
    return exits.success();
  },



};
