/* jshint indent: 2 */

var Sequelize = require('sequelize');
var sequelize = require('../database/database');

module.exports = sequelize.define('skill', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        created: {
            type: Sequelize.DATEONLY,
                allowNull: true
        },
        last_updated: {
            type: Sequelize.DATEONLY,
                allowNull: true
        },
        parent_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'skill'
});
