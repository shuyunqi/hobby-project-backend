var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var app = express();

// var DB_user = require('../DB/user');
var hobby_DB = require('../DB/DB');
var sequelize = require('../DB/connect');

router.get('/current', function(req, res, next) {
  if(req.query.type == 'All'){
    hobby_DB.script.findAll().then(function(script){
      res.json(JSON.parse(JSON.stringify(script)));
    })
  }else if(req.query.id){
    hobby_DB.script.findOne({ where: { id: req.query.id }}).then(function(script){
      res.json(JSON.parse(JSON.stringify(script)));
    })
  }
});

router.post('/add', function(req, res) {
  if(req.body.token){
    var check = true;
    var name = req.body.name?req.body.name:check = false;
    var author = req.body.author?req.body.author:"";
    var pubishHouse = req.body.publishHouse?req.body.publishHouse:"";
    var pubishTime = req.body.pubishTime?req.body.pubishTime:"";
    var script_tag = req.body.script_tag?JSON.stringify(req.body.script_tag):"";
    var price = req.body.price?req.body.price:"";
    var context = req.body.context?req.body.context:"";
    var discount = req.body.discount?req.body.discount:1;
    if(check){
      hobby_DB.script.create({
        name:name,
        author: author,
        pubishHouse: pubishHouse,
        pubishTime: pubishTime,
        script_tag: script_tag,
        price: price,
        context: context
      }).then(function(script){
        res.send(JSON.parse(JSON.stringify(script)))
      })
    }else{
      res.send({error: 'check'})
    }
  }else{
    res.send({error: 'token'})
  }
});

router.put('/delete',function(req,res){
  console.log('aaaaaaaaaaa query',req.params)
  console.log('aaaaaaaaaaa body',req.body)
  if(req.body.token){
    hobby_DB.script.destroy({where: { id: req.body.id,name: req.body.name }}).then(function(){
      res.send({success: "1"});
    });
  }else{
    res.send({error: 'token'})
  }
})

module.exports = router;