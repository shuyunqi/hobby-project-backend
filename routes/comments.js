var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var app = express();

// var DB_user = require('../DB/user');
var hobby_DB = require('../DB/DB');
var sequelize = require('../DB/connect');

router.get('/current', function(req, res, next) {
  if(req.query.scriptId){
    hobby_DB.comment.findAll({where:{scriptId:req.query.scriptId}}).then(function(comments){
      comments = JSON.parse(JSON.stringify(comments));
      if(comments.length==0){
        res.send([]);
      }else{
        comments.forEach(function(c,index){
          hobby_DB.user.findOne({where:{id:c.userId}}).then(function(user){
            user = JSON.parse(JSON.stringify(user));
            c.user = {};
            c.user.email = user.email;
            user.name?c.user.name = user.name:null;
            if(index == comments.length-1){
              res.send(JSON.parse(JSON.stringify(comments)));
            }
          })
        })
      }
    })
  }
});

router.put('/add', function(req, res, next) {
  if(req.body.token){
    hobby_DB.user.findOne({ where: { token: req.body.token }}).then(function(user){
      if(user){
        hobby_DB.comment.create({
          userId: user.id,
          scriptId: req.body.scriptId,
          text: req.body.comment
        }).then(function(){
          hobby_DB.comment.findOne({where: { userId: user.id,scriptId: req.body.scriptId,text: req.body.comment}}).then(function(comment){
            comment = JSON.parse(JSON.stringify(comment));
            comment.user = {};
            comment.user.email = user.email;
            user.name?comment.user.name = user.name:null;
            res.send(comment);
          })
        })
      }else{
        res.send({error:'no user'})
      }
    })
  }else{
    res.json({error: 'token is not exist'})
  }
});

module.exports = router;