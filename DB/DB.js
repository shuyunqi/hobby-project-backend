var express = require('express');
var Sequelize = require('sequelize');
var mysql = require('mysql');
var sequelize = require('./connect');
var test = require('./test_data');
var hobby_DB = {};

hobby_DB.user = sequelize.define('user', {
  // auto increment, primaryKey, unique
  id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},

  name : {type : Sequelize.STRING},
  email : {type : Sequelize.STRING, allowNull : false},
  passwd : {type : Sequelize.STRING, allowNull : false},
  lg_sign : {type : Sequelize.BOOLEAN, defaultValue : 0},
  login_time : {type : Sequelize.DATE, allowNull : true},
  level: {type : Sequelize.INTEGER, allowNull : true,defaultValue: 1},
  token : {type : Sequelize.STRING, allowNull : true},
  // default value
  deadline : {type : Sequelize.DATE, defaultValue : Sequelize.NOW}
});

hobby_DB.script = sequelize.define('script',{
  id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},


  name : {type : Sequelize.STRING, allowNull : false},
  picture : {type : Sequelize.STRING, allowNull : true},
  images : {type : Sequelize.STRING, allowNull : true},
  author : {type : Sequelize.STRING, allowNull : true},
  pubishHouse : {type : Sequelize.STRING, allowNull : true},
  pubishTime : {type : Sequelize.DATE, allowNull : true},
  script_tag : {type : Sequelize.STRING, allowNull : true},
  price : {type : Sequelize.INTEGER, allowNull : false},
  discount : {type : Sequelize.STRING, allowNull : true},
  context : {type : Sequelize.STRING, allowNull : true},
  store: {type : Sequelize.INTEGER, allowNull : true},
  // default value
  deadline : {type : Sequelize.DATE, defaultValue : Sequelize.NOW}
});

hobby_DB.comment = sequelize.define('comment',{
  id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},

  text : {type : Sequelize.STRING, allowNull : false},
  comment_tag : {type : Sequelize.STRING, allowNull : true},

  // script_id : {type : Sequelize.INTEGER, allowNull : false},

  deadline : {type : Sequelize.DATE, defaultValue : Sequelize.NOW}
});

hobby_DB.consignee = sequelize.define('consignee',{
  id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},

  name : {type : Sequelize.STRING, allowNull : true},
  address : {type : Sequelize.STRING, allowNull : false},
  postcode : {type : Sequelize.INTEGER, allowNull : false},
  phone : {type : Sequelize.STRING, allowNull : false},

  // user_id : {type : Sequelize.INTEGER, allowNull : false},

  deadline : {type : Sequelize.DATE, defaultValue : Sequelize.NOW}
});

hobby_DB.orderForm = sequelize.define('order_form',{
  id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},

  order_account : {type : Sequelize.STRING, allowNull : false},
  order_time : {type : Sequelize.DATE, allowNull : false},
  business : {type : Sequelize.STRING, allowNull : false},
  shipping_method : {type : Sequelize.STRING, allowNull : true},
  status: {type : Sequelize.STRING, allowNull : false,defaultValue: 0},
  // user_id : {type : Sequelize.INTEGER, allowNull : false},
  // consignee_id : {type : Sequelize.INTEGER, allowNull : false},

  deadline : {type : Sequelize.DATE, defaultValue : Sequelize.NOW}
});

hobby_DB.shoppingCart = sequelize.define('cart',{
  id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},

  amount: {type : Sequelize.INTEGER, allowNull : false,defaultValue: 1},
  // user_id : {type : Sequelize.INTEGER, allowNull : false},
  // script_id : {type : Sequelize.INTEGER, allowNull : false},
  deadline : {type : Sequelize.DATE, defaultValue : Sequelize.NOW}
})

hobby_DB.user.hasMany(hobby_DB.consignee);
hobby_DB.user.hasMany(hobby_DB.orderForm);
hobby_DB.user.hasMany(hobby_DB.shoppingCart);
hobby_DB.user.hasMany(hobby_DB.comment);
hobby_DB.script.hasMany(hobby_DB.comment);
hobby_DB.script.hasMany(hobby_DB.shoppingCart);
hobby_DB.consignee.hasMany(hobby_DB.orderForm);



// sequelize.sync();
function sync(){
  for(var key in hobby_DB){
    hobby_DB[key].sync();
  }
  // for(var key in test){
  //   test[key].forEach(function(data){
  //     hobby_DB[key].create(data)
  //   })
  // }
}
sync();
module.exports = hobby_DB;