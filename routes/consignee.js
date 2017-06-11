var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var app = express();

// var DB_user = require('../DB/user');
var hobby_DB = require('../DB/DB');
var sequelize = require('../DB/connect');

router.get('/', function(req, res, next) {
  res.json({success:1})
});

router.get('/current', function(req, res, next) {
  // console.log(req.query);
  // var request = JSON.parse(req.query);
  if(req.query.token){
    hobby_DB.user.findOne({ where: { token: req.query.token } }).then(function(user){
      if(user){
        hobby_DB.consignee.findAll({where: { userId: user.id}}).then(function(consignees){
          if(consignees){
            res.json(consignees);
          }else{
            res.send({token: 'token is not right'})
          }
        })
      }else{
        res.send({error: 'no login'});
      }
    })
  }else{
    res.send({error: 'token is not exist'});
  }
});

router.put('/add',function(req,res){
  if(req.body.token){
    hobby_DB.user.findOne({where:{token: req.body.token}}).then(function(user){
      hobby_DB.consignee.create({
        name: req.body.name,
        address: req.body.address,
        postcode: '214122',
        phone: req.body.phone,
        userId: user.id
      }).then(function(resp){
        hobby_DB.consignee.findOne({where:{
          name: req.body.name,
          address: req.body.address,
          postcode: '214122',
          phone: req.body.phone,
          userId: user.id
        }}).then(function(con){
          res.send(con);
        })
      })
    });
  }else{
    res.send({error: 'token is not exist'})
  }
});

router.put('/delete', function(req, res, next) {
  if(req.body.token){
    hobby_DB.user.findOne({ where: { token: req.body.token }}).then(function(user){
      hobby_DB.consignee.destroy({ where: { id:req.body.consigneeId ,userId: user.id}}).then(function(have){
        res.json({id: req.body.consigneeId})
      })
    })
  }else{
    res.json({error: 'token is not exist'})
  }
});

module.exports = router;