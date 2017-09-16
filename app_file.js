var express = require ('express'); //모듈 장착
var app = express();    //익스프레스 프레임워크 생성
var fs = require ('fs');  
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
app.set('views', './views_file');  // views를 저장할 위치 지정

app.set('view engine', 'jade'); //engine 무엇을 사용할지
app.use('/user', express.static('uploads'));
app.get('/upload', function(req, res){
  res.render('upload');
});

app.post('/upload', upload.single('userfile'), function(req, res){
  console.log(req.file);
  res.send('Uploaded : '+req.file.filename);
});
app.get('/topic/new', function(req, res){  //라우팅
  fs.readdir('data', function(err, files){    //디렉토리 경로,콜백
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  res.render('new', {topics:files});            // new제이드파일 사용 render topics이름으로 files전달
  });
});
app.get(['/topic','/topic/:id'], function(req, res){
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    var id = req.params.id;
    if(id){
    //id값 있을떄

    fs.readFile('data/'+id, 'utf8', function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
        }
      res.render('view',{topics:files, title:id, description:data});
      })
    } else {
    //id값 없을때
    res.render('view', {topics:files, title:'welcome', description:'Hello,JavaScript for server.'});
    }
  })
});
/*app.get('/topic/:id', function (req, res){
  var id = req.params.id;
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    fs.readFile('data/'+id, 'utf8', function(err, data){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      res.render('view',{topics:files, title:id, description:data});
    })
  })
})*/

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
