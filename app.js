var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser')
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: false}))
app.get('/form', function(req, res){
  res.render('form');
});
app.get('/form_receiver', function(req, res){
  var title = req.query.title;
  var description = req.query.description;
  res.send(title+','+description); //겟 방식 전송
});
app.post('/form_receiver', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  res.send(title+','+description)  //포스트방식 전송
})
//script(src='/assets/init.js')
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.get('/template', function(req , res){
  res.render('temp', {time:Date(), _title:'Jade'});
})
app.get('/topic', function(req, res){

  var topics = [
    'java script is ....',
    'express is ....',
    'Nodejs is ....'
      ]
      var output = `
      <a href="/topic?id=0">JavaScript</a><br>
      <a href="/topic?id=1">express</a><br>
      <a href="/topic?id=2">NodeJS</a><br>
      ${topics[req.query.id]}
      `
      res.send(output);

      res.send(topics[req.query.id]);
})
app.get('/dynamic', function(req , res){
  var lis = '';
  for(var i=0; i<5; i++){
    lis = lis + `<li>coding</li>`;
  }
  var time = Date();
  var output =`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
      Hello, Dynamic!
      <ul>
      ${lis}
      </ul>
      ${time}
    </body>
  </html>`
  res.send(output)
})
app.get('/', function(req , res){
  res.send('Hello home page');
});
app.get('/route', function(req, res){
  res.send('Hello Router, <img src="/route.png">')
})
app.get('/Login', function(req, res){
  res.send('Login Please')
})
app.listen(3000, function(){
  console.log('Conneted 3000 port!');
});
