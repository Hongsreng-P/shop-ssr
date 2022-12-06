const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        notNull: true,
        primaryKey: true
    },
    name: Sequelize.STRING,
    password: Sequelize.STRING
});

module.exports = User;