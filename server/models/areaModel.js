const sequelize = require('../server')
const { DataTypes } = require('sequelize')

const Area = sequelize.define('Area',{
    areaName: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
  })

module.exports = Area;
