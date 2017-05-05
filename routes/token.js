var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var app = express();

// var DB_user = require('../DB/user');
var hobby_DB = require('../DB/DB');
var sequelize = require('../DB/connect');

router.post('/',function(req,res){
  res.send({success:'1'})
})
module.exports = router;
