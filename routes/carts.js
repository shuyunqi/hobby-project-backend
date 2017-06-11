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
          hobby_DB.shoppingCart.create({
            amount: req.body.amount?req.body.amount:1,
            userId: req.body.userId,
            scriptId: req.body.bookId
          }).then(function(){
            hobby_DB.script.findOne({ where: {id: req.body.bookId}}).then(function(book){
              book = JSON.parse(JSON.stringify(book));
              book.amount = req.body.amount?req.body.amount:1;
              res.json(book)
            })
          });
        }
      })
    }
  }else{
    res.json({error: 'token is not exist'})
  }
});
router.put('/delete', function(req, res, next) {
  if(req.body.token){
    hobby_DB.user.findOne({ where: { token: req.body.token }}).then(function(user){

      if(req.body.cartId){
        hobby_DB.shoppingCart.destroy({ where: { scriptId:req.body.cartId ,userId: user.id}}).then(function(have){
          res.json({id: req.body.cartId})
        })
      }
      else if(req.body.cartIds){
        var respon_data = [];
        req.body.cartIds.forEach(function(id,key){
          hobby_DB.shoppingCart.destroy({ where: { scriptId:id ,userId: user.id}}).then(function(have){
            respon_data.push({id:id});
            if(key==req.body.cartIds.length-1){
              res.json(respon_data);
            }
          })
        })
      }else{
        res.send({error: 'params wrong'});
      }
    })
  }else{
    res.json({error: 'token is not exist'})
  }
});

module.exports = router;