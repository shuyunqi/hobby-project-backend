var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var app = express();
var request = require('request');
var iconv = require('iconv-lite');
var search = require('./search/common');
// var DB_user = require('../DB/user');
var hobby_DB = require('../DB/DB');
var sequelize = require('../DB/connect');

router.get('/', function(req, res, next) {
  if(req.query.search == 'My'){
    hobby_DB.script.findAll().then(function(scripts){
      var books = JSON.parse(JSON.stringify(scripts));
      var result = books.filter(function(b){
        var sign = false;
        if(b.name.indexOf(req.query.data)>=0)
          sign = true;
        else if(b.author.indexOf(req.query.data)>=0)
          sign = true;
        return sign
      })
      res.send(result);
    })
  }else if(req.query.search == 'All'){
    var options = {
      method: 'GET',
      url: 'https://www.amazon.cn/s/ref=nb_sb_noss',
      qs:
      {
        __mk_zh_CN: '亚马逊网站',
        url: 'search-alias=stripbooks',
        'field-keywords': req.query.data
      },
      headers:
      {
        'cache-control': 'no-cache'
      }
    };

    var dangdang_options={
      method: 'GET',
      url: 'http://search.dangdang.com',
      qs:{
        key: req.query.data,
        act: 'input'
      },
      headers:
      {
        'cache-control': 'no-cache'
      }
    };
    function searchYamaxun(options){
      request(options, function (error, response, body) {
        if(body.length>0){
          data = search.search_yamaxun(body);
          if(data.length>0)
            res.send(data);
          else{
            setTimeout(function(){
              searchYamaxun(options);
            },0)
          }
        }
      });
    }
    searchYamaxun(options);



  }
});

var yamaxun_crawler = function(data){

  search.search_yamaxun(data);

  // var title = getTitle(data);
  // var use = cut(data,'s-results-list-atf','paRightContent');

  // var ul = getUl(data,'s-results-list-atf');
  // var liArray = getLi(data,'s-result-item');
  // console.log('uuuuuuuuuuuuu',ul);
  // console.log('ttttttttttttt',title)
}
function getUl(view,cri){
  if(view.indexOf(cri)>=0 && view.indexOf('<ul')>=0){
    var m = view.indexOf(cri);
    var front = view.substring(0,m);
    var b = view.lastIndexOf('<ul')-3;
    var leave = view.substring(b);
    var f = leave.indexOf('</ul>');
    var one = leave.substring(0,f);
    return one;
  }
}

function getLi(data,criterias){
  var lis = [];
  function li(data){
    if(data.indexOf('<li')>=0){
      var begin = data.indexOf('<li');
      var over = data.indexOf('</li>');
      var one = data.substring(begin,over+5);
      if(one.indexOf(criterias)>=0){
        // console.log('88888888888888',one);
        lis.push(one);
      };
      var leave = data.substring(over+5);
      li(leave);
    }
  }
  li(data);
  return lis;
}
function getBody(data){
  var begin = data.indexOf('<body');
  var finish = data.indexOf('</body>');
  return data.substring(begin,finish+6);
}
function isInclude(data,test){
  if(data.indexOf(test)>=0)
    return true;
  else
    return false;
}




module.exports = router;