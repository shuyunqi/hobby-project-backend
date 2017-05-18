var common = {
  search_yamaxun: _search_yamaxun,
  search_dangdang: _search_dangdang
}

function _search_yamaxun(data){
  var one,two=[];
  one = cut(data,'search-main-wrapper','staticContent');
  if(one.length>0 && typeof one == 'string'){
    two = getHtml(one,'li','s-result-item')
  }
  var title = getTitle(data);
  var books = [];
  if(two.length>0){
    two.forEach(function(o){
      var img = getImg(o)
      var name = getName(o);
      var time = getContext(o,'span','a-size-small');
      var author = getContext(o,'span','a-size-small',2);
      var price = getContext(o,'span','a-size-base');
      if(price.indexOf('￥')>=0)
        price = price.substring(1);
      var book = new _book(name,time,author,price,img);
      books.push(book);
    });
  }
  console.log('yyyyyyyyyyyyyyyyy',data.substring(0,1000));
  return uniqeByKeys(books);
}
function _search_dangdang(data){

  var one,two=[];
  one = cut(data,'search_nature_rg','<script>');
  if(one.length>0 && typeof one == 'string'){
    two = getHtml(one,'li','ddt-pit');
  }
  var title = getTitle(data);
  console.log('ttttttttttttt',data.substring(0,1000));
  console.log('rrrrrrrrrrrrr',title);
  console.log('ooooooooooooo',two[0]);
}

function _book(name,time,author,price,img){
  this.name = name;
  this.pubishTime = time;
  this.author = author;
  this.images=img;
  this.price = price
}

function cut(data,begin,finish){
  var b,f,result;
  if(data.indexOf(begin)<0)
    return false;
  b = data.indexOf(begin);
  f = data.indexOf(finish);
  if(f>b)
    result = data.substring(b,f);
  else
    result = data.substring(b);
  return result;
}

function getTitle(data){
  if(data.indexOf('<title')>=0){
    var begin = data.indexOf('<title');
    var leave = data.substring(begin);
    var over = leave.indexOf('</title>');
    var one = leave.substring(0,over+8);
    return one;
  }
}


function getHtml(data,dom,cri){
  var arrays = [];
  function g(view){
    if(view.indexOf(cri)>=0){
      var one;
      var target = view.indexOf(cri);
      var before = view.substring(0,target);
      var b = before.lastIndexOf('<'+dom);
      if(b>=0)
        before = view.substring(b);
      else
        return false;
      var f = before.indexOf(dom+'>');
      if(f>=0)
        one = before.substring(0,f+dom.length+1);
      else
        return false;
      var leave = view.substring(f+dom.length+1);
      arrays.push(one);
      g(leave);
    }
  }
  g(data);
  return arrays;
}

function getImg(data){
  if(data.indexOf('src')>=0){
    var b = data.indexOf('src');
    var use = data.substring(b+5);
    var f = use.indexOf('"');
    var one = use.substring(0,f);
    return one;
  }
}
function getName(data){
  if(data.indexOf('data-attribute')>=0){
    var b = data.indexOf('data-attribute');
    var use = data.substring(b+16);
    var f = use.indexOf('"');
    var one;
    if(use.indexOf('&#')>=0)
      one = Unicode2Native(use.substring(0,f));
    return one;
  }
}
function getContext(data,dom,cri,n){
  if(!n)n=1;
  var sign = 0;
  var result="";
  function find(view){
    if(view.indexOf(cri)>=0){
      var b = view.indexOf(cri);
      var cut = view.substring(b);
      b = cut.indexOf('>');
      cut = cut.substring(b+1);
      var f = cut.indexOf('</'+dom);
      var one = cut.substring(0,f);
      var leave = cut.substring(f+dom.length+2);
      if(one && one.length>0){
        sign = sign+1;
        if(sign == n){
          result = one;
        }
        else
          find(leave);
      }
      else
        find(leave);
    }
    else
      return false;
  }
  find(data);
  return result;
}

function Unicode2Native(data) {
  var code = data.match(/&#(\d+);/g);
  var result ="";
  if(code){
    for (var i=0; i<code.length; i++)
      result = result + String.fromCharCode(code[i].replace(/[&#;]/g, ''));
  }
  return result;
}
function gb2utf8(data){
  var glbEncode = [];
  gb2utf8_data = data;
  execScript("gb2utf8_data = MidB(gb2utf8_data, 1)", "VBScript");
  var t=escape(gb2utf8_data).replace(/%u/g,"").replace(/(.{2})(.{2})/g,"%$2%$1").replace(/%([A-Z].)%(.{2})/g,"@$1$2");
  t=t.split("@");
  var i=0,j=t.length,k;
  while(++i<j) {
     k=t[i].substring(0,4);
     if(!glbEncode[k])
     {
        gb2utf8_char = eval("0x"+k);
        execScript("gb2utf8_char = Chr(gb2utf8_char)", "VBScript");
        glbEncode[k]=escape(gb2utf8_char).substring(1,6);
     }
     t[i]=glbEncode[k]+t[i].substring(4);
  }
  gb2utf8_data = gb2utf8_char = null;
  return unescape(t.join("%"));
}


function obj2key(obj, keys){
  var key=[];
  if(keys){
    var n = keys.length;
    keys.forEach(function(k){
      key.push(obj[k]);
    });
  }else{
    for(var k in obj){
      key.push(obj[k]);
    }
  }
  return key.join('|');
}
//去重操作
function uniqeByKeys(array,keys){
  keys = keys?keys:false;
  var arr = [];
  var hash = {};
  for (var i = 0, j = array.length; i < j; i++) {
      var k = obj2key(array[i], keys);
      if (!(k in hash)) {
          hash[k] = true;
          arr .push(array[i]);
      }
  }
  return arr ;
}





module.exports = common;