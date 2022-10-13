const Sequelize = require('sequelize');

module.exports.USER_SCHEMA = {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    login: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
};