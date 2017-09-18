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
      <a href="/auth/logout">Logut</a></li>
      `);
  }else{
    res.send(`
      <h1>welcome</h1>
      <ul>
      <li><a href="/auth/login">Login</a>
      <li><a href="/auth/register">Register</a></li>
      </ul>
      `);
  }
})
var users = [
  {
  username:'egoing',
  password:'111',
  displayName:'SeoWonHo'
  }
];
app.post('/auth/register', function(req,res){
  var user = {
    username :req.body.username,
    password : req.body.password,
    displayName :req.body.displayName
  };
  users.push(user);
  req.session.displayName = req.body.displayName;
  req.session.save(function(){
      res.redirect('/welcome');
  })
})
app.get('/auth/register',  function(req,res){
  var output =`
  <h1>Register</h1>
  <form action = "/auth/register" method="post">
    <h1>Login</h1>
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="placeholder">
    </p>
    <p>
      <input type="text" name="displayName" placeholder="displayName">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>

  `
  res.send(output);
})
app.get('/auth/logout', function(req,res){
  delete req.session.displayName;         //값 삭제
  res.redirect('/welcome');              //리다이렉트
})

app.post('/auth/login',function(req,res){

  var uname = req.body.username;
  var pwd = req.body.password;
  for(var i=0; i<users.length; i++){
    var user = users[i];
    if(uname === user.username && pwd === user.password){
      req.session.displayName = user.displayName;
      return req.session.save(function(){
        res.redirect('/welcome');
        });
      }
    }
      res.send('Who are you <a href="/auth/login"> Login </a>');
  });
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
