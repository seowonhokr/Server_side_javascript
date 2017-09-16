var express = require ('express'); //모듈 장착
var app = express();    //익스프레스 프레임워크 생성
var fs = require ('fs');
var mysql = require('mysql');
var conn = mysql.createConnection({
  host    :'localhost',
  user    :'root',
  password:'asd6145',
  database:'o2',
});

conn.connect();
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb){
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: _storage });

app.use(bodyParser.urlencoded({extended:false}));   //외우기
app.locals.pretty = true;  //제이드파일 코드 간결하게
app.set('views', './views_mysql');  // views를 저장할 위치 지정

app.set('view engine', 'jade'); //engine 무엇을 사용할지
app.use('/user', express.static('uploads'));
app.get('/upload', function(req, res){
  res.render('upload');
});

app.post('/upload', upload.single('userfile'), function(req, res){
  console.log(req.file);
  res.send('Uploaded : '+req.file.filename);
});
app.get('/topic/add', function(req, res){
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql, function(err, topics, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('add',{topics:topics });
  })
});
  app.post('/topic/add', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
    conn.query(sql, [title, description, author], function(err, results,fields){
      if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
      }else{
        res.redirect('/topic/'+results.insertId);
      }
    })
//    fs.writeFile('data/'+title,description, function(err){  //폴더명 저장할 데이터 콜백
//})//라우팅
});
app.get(['/topic/:id/edit'], function(req, res){
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql, function(err, topics, fields){
    var id = req.params.id;
    if(id){
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql,[id], function(err, topic, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else{
            res.render('edit',{topics:topics, topic:topic[0] });
        }
      });
    } else {
      console.log('Teere is no id');
      res.status(500).send('Internal Server Error');
    }
  })
});

app.get('/topic/:id/delete', function(req, res){
  var sql = 'SELECT id,title FROM topic';
  var id = req.params.id;
    conn.query(sql, function(err, topics, fields){
     var sql = 'SELECT * FROM topic WHERE id=?';
     conn.query(sql, [id], function(err,topic){
       if(err){
         console.log(err);
         res.status(500).send('Internal Server Error');
       }else{
           if(topic.length === 0){
             console.log('There is no record');
             res.status(500).send('Internal Server Error');
         }else{
         res.render('delete',{topics:topics, topic:topic[0]});
       }
        }
     });
  });
 });
 app.post('/topic/:id/delete', function(req, res){
   var id = req.params.id;
   var sql = 'DELETE FROM topic WHERE id=?';
   conn.query(sql,[id],function(err, result){
     res.redirect('/topic/');
   });
 });
app.get(['/topic' ,'/topic/:id'], function(req, res){
  var sql = 'SELECT id,title FROM topic';
  conn.query(sql, function(err, topics, fields){
    var id = req.params.id;
    if(id){
      var sql = 'SELECT * FROM topic WHERE id=?';
      conn.query(sql,[id], function(err, topic, fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else{
            res.render('view',{topics:topics, topic:topic[0] });
        }
      });
    } else {
      res.render('view',{topics:topics});
    }
  })
});

app.post('/topic', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title,description, function(err){  //폴더명 저장할 데이터 콜백
    if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/'+title); //new post후 다음 재지정
  });
})
app.listen(3000, function(){
  console.log('Conneted, 3000 Port!');
})
