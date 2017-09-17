var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
app.use(bodyParser.urlencoded({ extended: false}));
app.use(session({
  secret:'d212d12s',
  resave:false,
  saveUninitialized:true,
  store:new FileStore()
}));
app.get('/count',function(req,res){
  if(req.session.count){
    req.session.count++;
  }else{
      req.session.count = 1 ;
  }

  res.send('count:'+  req.session.count);
})
app.get('/welcome', function(req,res){
  if(req.session.displayName){
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <a href="/auth/logout">Logut</a>
      `);
  }else{
    res.send(`
      <h1>welcome</h1>
      <a href="/auth/login">Login</a>
      `);

  }

})
app.get('/auth/logout', function(req,res){
  delete req.session.displayName;         //값 삭제
  res.redirect('/welcome');              //리다이렉트
})
app.post('/auth/login',function(req,res){
  var user = {
    username:'egoing',
    password:'111',
    displayName:'SeoWonHo'
  };
  var uname = req.body.username;
  var pwd = req.body.password;
  if(uname === user.username && pwd === user.password){
    req.session.displayName = user.displayName;
    res.redirect('/welcome');
  }else{
    res.send('Who are you <a href="/auth/login"> Login </a>');
  }

})
app.get('/auth/login',function(req,res){
  var output = `
  <form action = "/auth/login" method="post">
    <h1>Login</h1>
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="placeholder">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);

})
app.get('/tmp', function(req,res){
  res.send('result: '+req.session.count);
})
app.listen(3003, function(){
  console.log('Connected 3003 port!');
});
