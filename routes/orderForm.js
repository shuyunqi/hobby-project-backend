var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var app = express();

// var DB_user = require('../DB/user');
var hobby_DB = require('../DB/DB');
var sequelize = require('../DB/connect');

Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

router.get('/', function(req, res, next) {
  res.json({success:1})
});

router.get('/current', function(req, res, next) {
  if(req.query.token){
    hobby_DB.user.findOne({ where: { token: req.query.token } }).then(function(user){
      if(user){
        hobby_DB.orderForm.findOne({where:{userId:user.id,status:0}}).then(function(order){
          var books = JSON.parse(order.business);
          var order_books=[];
          for (var i in books){
            order_books.push(books[i]);
          }
          var use_books=[];
          order_books.forEach(function(b,index){
            hobby_DB.script.findOne({where:{id:b.id}}).then(function(book){
              book = JSON.parse(JSON.stringify(book));
              book.amount = b.amount;
              use_books.push(JSON.parse(JSON.stringify(book)));
              if(index == order_books.length-1){
                var resp = JSON.parse(JSON.stringify(order));
                delete resp.business;
                resp.books = use_books;
                res.json(resp);
              }
            })
          })
        })
      }else{
        res.send({token: 'token is not right'})
      }
    })
  }else{
    res.send({error: 'token is not exist'})
  }
});

router.put('/make',function(req,res){
  if(req.body.token){
    hobby_DB.user.findOne({where:{token: req.body.token}}).then(function(user){
      var books ={};var n =0;
      for(var i in req.body.data.books){
        var one = {
          id: req.body.data.books[i].id,
          amount: req.body.data.books[i].amount
        }
        books[n] = one;
        n++;
      }
      hobby_DB.orderForm.create({
        order_account: makeAccount(JSON.parse(JSON.stringify(user))),
        order_time: new Date().Format("yyyy-MM-dd hh:mm:ss"),
        userId: user.id,
        status: 0,
        business: JSON.stringify(books)
      }).then(function(){
        res.send({success:1});
      })
    })
  }else{
    res.send({error: 'token is not exist'})
  }
});

function makeAccount(user){
  var timestamp = Date.parse(new Date());
  var tou = user.email.substring(0,2).toUpperCase();
  var i = getRandom();
  var j = getRandom();
  var wei = i+user.token[i] + j + user.token[j];
  console.log(tou,timestamp,wei);
  return tou + timestamp + wei;
}
function getRandom(){
  return Math.ceil(Math.random()*10);
}

module.exports = router;