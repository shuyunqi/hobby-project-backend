var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var app = express();

// var DB_user = require('../DB/user');
var hobby_DB = require('../DB/DB');
var sequelize = require('../DB/connect');

router.get('/current', function(req, res, next) {
  if(req.query.token){
    hobby_DB.user.findOne({ where: { token: req.query.token }}).then(function(user){
      if(user){
        var result = [];
        hobby_DB.shoppingCart.findAll({ where : { userId: user.id }}).then(function(carts){
          carts.forEach(function(c,index){
            hobby_DB.script.findOne({where: {id: c.scriptId}}).then(function(script){
              if(script){
                script = JSON.parse(JSON.stringify(script));
                script.amount = c.amount;
                result.push(script);
              }
              if(index == carts.length-1){
                if(result.length>0)
                  res.json(result);
                else
                  res.json({error: 'no carts'})
              }
            })
          })
        }).then(function(){

        })
      }else{
        res.json({error: 'token is not exist'})
      }
    })
  }else{
    res.json({error: 'token is not exist'})
  }
});

router.put('/add', function(req, res, next) {
  // console.log('ddddddddddddddddd',req.body)
  if(req.body.token){
    if(req.body.userId && req.body.bookId){
      hobby_DB.shoppingCart.findOne({ where: { userId:req.body.userId ,scriptId: req.body.bookId}}).then(function(have){
        if(!have || have.length==0){
          hobby_DB.shoppingCart.build({
            amount: req.body.amount?req.body.amount:1,
            userId: req.body.userId,
            scriptId: req.body.bookId
          }).save();
        }
        res.json({success: 1})
      })
    }
  }else{
    res.json({error: 'token is not exist'})
  }
});

module.exports = router;