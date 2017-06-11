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
      if(req.query.type === 'All'){
        if(user.level === 0){
          hobby_DB.user.findAll({where:{}}).then(function(users){
            res.send(users);
          })
        }else{
          res.send({error: 'no Permission'});
        }
      }
      else{
        hobby_DB.user.update({lg_sign:true},{where:{token: req.query.token}})
        var response ={
          name: user.name,
          id: user.id,
          email: user.email,
          level: user.level
        }
        res.json(response);
      }
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
          hobby_DB.user.update({lg_sign:true},{where:{email: req.body.email}})
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
});
router.put('/edit',function(req,res){
  if(req.body.token){
    if(req.body.id=='mine'){
      hobby_DB.user.findOne({where: {token: req.body.token }}).then(function(mine){
        if(req.body.edit.name){
           hobby_DB.user.update({name: req.body.edit.name},{where: {token: req.body.token }}).then(function(user){
            hobby_DB.user.findOne({where: {token: req.body.token }}).then(function(resp){
              res.send({
                name:resp.name,
                id:resp.id,
                email:resp.email
              });
            })
          })
        }else if(req.body.edit.passwd){
          if(mine.passwd === req.body.criteria.passwd){
            hobby_DB.user.update({passwd: req.body.edit.passwd},{where: {token: req.body.token }}).then(function(user){
              res.send(user);
            })
          }else{
            res.send({error: 'password is not right'})
          }
        }
      })
    }
  }else{
    res.send({error: 'token is not exist'})
  }
})

router.put('/delete',function(req,res){
  if(req.body.token){
    hobby_DB.user.findOne({where:{token: req.body.token}}).then(function(user){
      if(user.level === 0){
        hobby_DB.user.destroy({where:{id:req.body.userId}}).then(function(){
          res.send({userId: req.body.userId});
        })
        hobby_DB.consignee.destroy({where:{userId:req.body.userId}});
        hobby_DB.orderForm.destroy({where:{userId:req.body.userId}});
      }
      else{
        res.send({error: 'no Permission'})
      }
    })
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
