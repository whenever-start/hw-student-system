var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var app = express();

var DB_URL = 'mongodb://localhost:27017';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 获取
router.get('/users/list', function(req, res, next) {
	var size = Number(req.query.size);
	var page = Number(req.query.page);
	if(page){
		mongo.connect(DB_URL,function(err,db){
			console.log('enter')
			if(err) throw err;
			var collection = db.db('studentDB').collection('student');
			collection.find(options).skip(page-1).toArray(function(err,result){
				if(err){
					var rs = {
						code:500,
						msg:err
					}
					throw err;
				}
				var rs = {
					code:200,
					msg:'操作成功',
					item:result
				}
				res.send(rs);
				db.close();
			});
		});
	}
	var options = req.query.options;
	console.log('options:',options)
	for(var key in options){
		if(key == 'stu_age'){
			options[key] = Number(options[key]);
		}
	}
	mongo.connect(DB_URL,function(err,db){
		console.log('enter')
		if(err) throw err;
		var collection = db.db('studentDB').collection('student');
		collection.find(options).toArray(function(err,result){
			if(err){
				var rs = {
					code:500,
					msg:err
				}
				throw err;
			}
			var rs = {
				code:200,
				msg:'获取成功',
				item:result
			}
			res.send(rs);
			db.close();
		});
	});
});

// 添加
router.post('/users/add', function(req, res, next) {
	console.log('接收：',req.body);
	var options = req.body;
	console.log('options:',options)
	for(var key in options){
		if(key == 'stu_age'){
			options[key] = Number(options[key]);
		}
	}
	mongo.connect(DB_URL,function(err,db){
		if(err) throw err;
		var collection = db.db('studentDB').collection('student');
		collection.insertOne(options,function(err,result){
			if(err){
				var rs = {
					code:500,
					msg:err
				}
				throw err;
			}
			var rs = {
				code:200,
				msg:'添加成功',
				item:result
			}
			res.send(rs);
			db.close();
		});
	});
});

// 删除
router.post('/users/del',function(req,res,next){
	var options = req.body;
	console.log('opt:',options);
	for(var i in options){
		var id = options[i];
		console.log(id)
		mongo.connect(DB_URL,function(err,db){
			if(err) throw err;
			var collection = db.db('studentDB').collection('student');
			collection.deleteOne({_id:id},function(err,result){
				if(err){
					var rs = {
						code:500,
						msg:err
					}
					throw err;
				}
				var rs = {
					code:200,
					msg:'删除成功',
					item:result
				}
				res.send(rs);
				db.close();
			});
		});
	}
})
module.exports = router;
