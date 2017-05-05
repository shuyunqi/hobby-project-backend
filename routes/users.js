var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var app = express();

// var DB_user = require('../DB/user');
var hobby_DB = require('../DB/DB');
var sequelize = require('../DB/connect');

router.get('/current', function(req, res, next) {
  // console.log(req.query);
  // var request = JSON.parse(req.query);
  hobby_DB.user.findOne({ where: { token: req.query.token } }).then(function(user){
    if(user){
      var response ={
        name: user.name,
        id: user.id,
        email: user.email,
      }
      res.json(response);
    }else{
      res.send({token: 'token is not right'})
    }
  })
});

router.post('/register',function(req,res){
  var token = jwt.encode(req.body.passwd, 'hob');
  var response = "0";
  if(req.body.email || req.body.passwd){

    hobby_DB.user.findOne({ where: { email: req.body.email } }).then(function(user){
      if(user){
        res.send({error: 'email is exist'});
      }else{
        hobby_DB.user.build({
          "email": req.body.email,
          "passwd": req.body.passwd,
          "lg_sign": 0,
          "token": token
        }).save().then(function(){
          res.send({success: '1'});
        })
      }
    })
  }else{
    res.send(response)
  }
})

router.post('/login',function(req,res){
  var token = jwt.encode(req.body.passwd, 'hob');
  var response = "0";
  if(req.body.email || req.body.passwd){
    hobby_DB.user.findOne({ where: { email: req.body.email } }).then(function(user){
      if(user && user.email){
        if(req.body.passwd === user.passwd){
          res.send({ token: user.token })
        }else{
          res.send({error: 'passwd'})
        }
      }else{
        res.send({error: 'email'})
      }
    })
  }else{
    res.send(response)
  }
})

router.put('/',function(req,res){
  var response_data = user_PUTaction(req.body);
  res.json(response_data);
})
router.put('/current',function(req,res){
  if(req.body.token){
    if(req.body.newPasswd){
      hobby_DB.user.update({ passwd: req.body.newPasswd} ,{ where: { token: token } }).then(function(){
        res.send({success:1});
      })
    }
  }else{
    res.send({error: 'token is not exist'})
  }
})

function user_POSTaction(options) {
  var token = jwt.encode(options.passwd, 'hob');
  if(!options.email || !options.passwd){
    return "0";
  }else{
    hobby_DB.user.build({
      "email": options.email,
      "passwd": options.passwd,
      "lg_sign": 0,
      "token": token
    }).save();
    hobby_DB.user.findOne({ where: { token: token } }).then(function(user){
      if(user){
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        return {
          token: user.token
        }
      }else{
        return '0';
      }
    })
  }
}

module.exports = router;
