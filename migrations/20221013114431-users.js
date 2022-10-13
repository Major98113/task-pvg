'use strict';
const { users } = require('../config/dump.json');
const { USER_SCHEMA } = require('../models/users.model');

module.exports = {
  up: async ( queryInterface ) => {
    await queryInterface.createTable( 'Users', USER_SCHEMA );

    for await ( let user of users ){
      await queryInterface.bulkInsert( 'Users', [{
        id: user.id,
        username: user.username,
        password: user.password,
        isDeleted: user.isDeleted
      }
      ]);
    }
  },

  down: async ( queryInterface ) => {
    await queryInterface.dropTable( 'Users' );
  }
};
