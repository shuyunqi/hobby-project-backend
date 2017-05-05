var Sequelize = require('sequelize');
var mysql = require('mysql');
var config = require('./config');

var sequelize = new Sequelize(
  config.DB_name,
  config.username,
  config.password,
  config.option
);

module.exports = sequelize;