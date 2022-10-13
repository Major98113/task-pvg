const Sequelize = require('sequelize');

module.exports.USER_DATA_SCHEMA = {
    user_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    permissions: Sequelize.ARRAY(Sequelize.STRING)
};