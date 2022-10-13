'use strict';
const { user_data } = require('../config/dump.json');
const { USER_DATA_SCHEMA } = require('../models/user-data.model');

module.exports = {
  up: async ( queryInterface ) => {
    await queryInterface.createTable( 'UserData', USER_DATA_SCHEMA );

    for await ( let data of user_data ){
      await queryInterface.bulkInsert( 'UserData', [{
        user_id: data.user_id,
        role: data.role,
        permissions: data.permissions,
        age: data.age
      }
      ]);
    }
  },

  down: async ( queryInterface ) => {
    await queryInterface.dropTable( 'UserData' );
  }
};
