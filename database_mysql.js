var mysql = require('mysql');
var conn = mysql.createConnection({
  host    :'localhost',
  user    :'root',
  password:'asd6145',
  database:'o2',
});
 
conn.connect();
/*    //js이용 DB 셀렉트 하는방법
var sql = 'SELECT * FROM  topic';
conn.query(sql,function(err, rows,fields){
  if(err) {
    console.log(err);
  } else {
    for(var i=0; i<rows.length; i++){
      console.log(rows[i].title);
    }
  }
});
*/
// js이용 DB INSERT 하는 방법
/*
var sql = 'INSERT INTO topic (title, description, author) VALUES(?,?,?)';
var params = ['Supervisor','Watcher','graphtittie'];
conn.query(sql,params, function(err, rows, fields){
  if(err){
    console.log(err);
  } else{
    console.log(rows.insertId);
  }
})*/
/*var sql = 'UPDATE topic SET title=?, description=? WHERE id=?';
var params = ['NPM','leeche',1];
conn.query(sql,params, function(err, rows, fields){
  if(err){
    console.log(err);
  } else{
    console.log(rows);
  }
})*/
var sql = 'DELETE FROM topic WHERE id=?';
var params = [1];
conn.query(sql,params, function(err, rows, fields){
  if(err){
    console.log(err);
  } else{
    console.log(rows);
  }
})
conn.end();
