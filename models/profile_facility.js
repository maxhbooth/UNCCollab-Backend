/* jshint indent: 2 */

var Sequelize = require('sequelize');
var sequelize = require('../database/database');

module.exports = sequelize.define('profile_facility', {
        profile_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'profile',
                key: 'id'
            }
        },
        facility_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'facility',
                key: 'id'
            }
        },
    created: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    last_updated: {
        type: Sequelize.DATEONLY,
        allowNull: true
    }
    }, {
        tableName: 'profile_facility'
    });