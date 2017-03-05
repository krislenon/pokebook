var express = require('express');
var mysql = require('mysql');
var app = express();
var path = require('path');
var localStorage;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use('/CSS',express.static(path.join(__dirname, '/CSS')))
app.use('/Images',express.static(path.join(__dirname, '/Photos')))
const PORT = 3000;
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'project'
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/HTML/index.html');
});

app.get('/login', function(req,res){
	res.sendFile(__dirname + '/HTML/Login.html');
});

app.get('/register', function(req,res){
	res.sendFile(__dirname + '/HTML/Register.html');
});
app.get('/profile/:logged_in_id/view/:view_id', function(req,res){
	res.sendFile(__dirname + '/HTML/profile.html');
});
app.get('/home/:id', function(req,res){
	res.sendFile(__dirname + '/HTML/home.html');
});
app.get('/friends/:id', function(req,res){
	res.sendFile(__dirname + '/HTML/Friends.html');
});
app.get('/friendreq/:id', function(req,res){
	res.sendFile(__dirname + '/HTML/Friend_requests.html');
});

//register function
app.post('/register', function(req,res){
	var user = req.body;	
	var qString = "Insert into user(email,fullname,password) values (\""+user.email+"\",\""+user.name+"\",\""+user.password+"\");"
	
	connection.query(qString, function(err, rows, fields) {
	    if (!err) {
				res.send(rows);
			}
			else{
				console.log(err);
			}
	});
});

//Login function
app.post('/login', function(req,res){
	var user = req.body;
	var qString = "Select * from user where email=\'" +user.email+ "\' AND password=\'" +user.password+ "\'";
	
	connection.query(qString, function(err, rows, fields) {
	    if (!err) {
	    		localStorage = rows[0].user_id;
				res.send(rows);
			}
			else{
				console.log(err);
			}
	});
});

app.get('/auth/user', function(req,res){
	res.send(localStorage);
});

app.get('/logout', function(req,res){
	res.redirect('/');
});

app.get('/usr/:id', function(req, res) {
  connection.query('SELECT * FROM user where user_id = ?',req.params.id, function(err, rows, fields) {
    if (!err) {
      res.send(rows);
    }
    else {
      console.log(err);
    }
  })
});

app.get('/usr/:id/posts', function(req, res) {
  connection.query('SELECT * FROM post where fk_author_id = ?',req.params.id, function(err, rows, fields) {
    if (!err) {
      res.send(rows);
    }
    else {
      console.log(err);
    }
  })
});

app.get('/usr/:user_id/add/:friend_id', function(req, res) {
  connection.query("INSERT INTO `friends`(`fk_user_id`, `friendid`, `Accepted`) VALUES ("+req.params.user_id+","+req.params.friend_id+",0)", function(err, rows, fields) {
    if (!err) {
      res.send(rows);
    }
    else {
      console.log(err);
    }
  })
});

app.get('/usr/:user_id/remove/:friend_id', function(req, res) {
  var qString = "DELETE FROM `friends` WHERE (`fk_user_id`="+req.params.user_id+" AND `friendid`="+req.params.friend_id+") OR (`friendid`="+req.params.user_id+" AND `fk_user_id`="+req.params.friend_id+")";
  connection.query(qString, function(err, rows, fields) {
    if (!err) {
      res.send(rows);
    }
    else {
      console.log(err);
    }
  })
});

app.get('/usr/:user_id/accept/:friend_id', function(req, res) {
  var qString = "UPDATE `friends` SET `Accepted`=1 WHERE `fk_user_id`="+req.params.friend_id+" AND `friendid`=" +req.params.user_id;
  connection.query(qString, function(err, rows, fields) {
    if (!err) {
      res.send(rows);
    }
    else {
      console.log(err);
    }
  })
});

app.get('/usr/:user_id/friendreqs', function(req,res){
	var qString = "SELECT * FROM friends JOIN user ON friends.fk_user_id=user.user_id WHERE Accepted=0 AND friendid=" + req.params.user_id;
	connection.query(qString, function(err, rows, fields) {
    if (!err) {
      res.send(rows);
    }
    else {
      console.log(err);
    }
  })
});

app.get('/usr/:id/friends', function(req, res) {
  var qString = "SELECT * FROM `user` WHERE user_id IN (SELECT friendid FROM friends WHERE (fk_user_id=" + req.params.id + ") AND Accepted=1) OR user_id IN (SELECT fk_user_id FROM friends WHERE (friendid=" + req.params.id + ") AND Accepted=1)";
  connection.query(qString, function(err, rows, fields) {
    if (!err) {
      res.send(rows);
    }
    else {
      console.log(err);
    }
  })
});

app.post('/add-post:id', function(req,res){
	var postvar = req.body;
	var x = req.params.id;			
	connection.query("Insert into post(authorname,fk_author_id,postmsg) values ((select fullname from user where user_id = ?),"+x+",\""+postvar.text+"\")",[req.params.id],function(err, rows, fields) {
	  if(!err){
	  	res.send(rows);
	  }
  	else{
			console.log(err);
		}

	});
});

app.get('/like-post/:post_id/:user_id', function(req,res){
	var qString = "INSERT INTO likes(fk_user_id, fk_post_id) VALUES("+req.params.user_id+","+req.params.post_id+")";
	connection.query(qString, function(err,rows,fields){
		if(!err){
			res.send(rows);
		}
		else{
			console.log(err);
		}
	});
});

app.get('/unlike-post/:post_id/:user_id', function(req,res){
	var qString = "DELETE FROM likes WHERE fk_user_id="+req.params.user_id+" AND fk_post_id="+req.params.post_id;
	connection.query(qString, function(err,rows,fields){
		if(!err){
			res.send(rows);
		}
		else{
			console.log(err);
		}
	});
});

app.get('/delete-post/:post_id', function(req,res){
	var qString = "DELETE FROM post WHERE post_id="+req.params.post_id;
	connection.query(qString, function(err,rows,fields){
		if(!err){
			res.send(rows);
		}
		else{
			console.log(err);
		}
	});
});

app.post('/add-comment/:id/:post_id', function(req,res){
	var postvar = req.body;
	var x = req.params.id;			
	var qString = "Insert into comment(authorname,fk_author_id,fk_post_id, commentmsg) values ((select fullname from user where user_id = ?),"+x+","+req.params.post_id+",\""+postvar.text+"\")";
	connection.query(qString,[req.params.id],function(err, rows, fields) {
	  if(!err){
	  	res.send(rows);
	  }
  	  else{
		console.log(err);
	  }
	});
});

app.post('/update-post/:id', function(req,res){
	var postvar = req.body;
	var qString = "UPDATE post SET postmsg=\"" + postvar.text + "\" WHERE post_id = " + req.params.id;
	connection.query(qString, function(err,rows,fields){
		if(!err){
			res.send(rows);
		}
		else{
			console.log(err);
		}
	});
});

app.get('/view-post/:id', function(req, res) {
	var qString = "SELECT created_at,post_id, authorname, postmsg, fk_author_id, (SELECT COUNT(fk_user_id) as num_likes FROM likes WHERE fk_post_id = post.post_id) as num_likes,  (SELECT COUNT(fk_user_id) FROM likes WHERE fk_post_id = post.post_id AND fk_user_id ="+req.params.id+") as user_liked  FROM post WHERE post.fk_author_id IN (SELECT friends.friendid FROM friends WHERE Accepted = 1 AND friends.fk_user_id="+req.params.id+")  OR post.fk_author_id ="+req.params.id+" ORDER BY created_at DESC;";
  connection.query(qString, function(err, rows, fields) {
    if (!err) {
      res.send(rows);
    }
    else{
    	console.log(err);
    }
  })
});

app.get('/post/:post_id/comments/:user_id', function(req, res) {
	var qString = "SELECT created_at,authorname,commentmsg, fk_author_id, comment_id, (SELECT COUNT(fk_user_id) as num_likes FROM likes WHERE fk_comment_id = comment.comment_id) as num_likes, (SELECT COUNT(fk_user_id) FROM likes WHERE fk_comment_id = comment.comment_id AND fk_user_id = " + req.params.user_id + ") as user_liked FROM `comment` WHERE fk_post_id = " + req.params.post_id + " ORDER BY created_at ASC";
  connection.query(qString, function(err, rows, fields) {
    if (!err) {
      res.send(rows);
    }
    else{
    	console.log('comments',err);
    }
  })
});

app.get('/like-comment/:comment_id/:user_id', function(req,res){
	console.log('like c')
	var qString = "INSERT INTO likes(fk_user_id, fk_comment_id) VALUES("+req.params.user_id+","+req.params.comment_id+")";
	connection.query(qString, function(err,rows,fields){
		if(!err){
			res.send(rows);
		}
		else{
			console.log(err);
		}
	});
});

app.get('/unlike-comment/:comment_id/:user_id', function(req,res){
	var qString = "DELETE FROM likes WHERE fk_user_id="+req.params.user_id+" AND fk_comment_id="+req.params.comment_id;
	connection.query(qString, function(err,rows,fields){
		if(!err){
			res.send(rows);
		}
		else{
			console.log(err);
		}
	});
});

app.get('/delete-comment/:comment_id', function(req,res){
	var qString = "DELETE FROM comment WHERE comment_id="+req.params.comment_id;
	connection.query(qString, function(err,rows,fields){
		if(!err){
			res.send(rows);
		}
		else{
			console.log(err);
		}
	});
});

app.post('/update-comment/:id', function(req,res){
	var postvar = req.body;
	var qString = "UPDATE comment SET commentmsg=\"" + req.body.text + "\" WHERE comment_id = " + req.params.id;
	connection.query(qString, function(err,rows,fields){
		if(!err){
			res.send(rows);
		}
		else{
			console.log(err);
		}
	});
});

app.get('/search/:id', function(req,res){
	res.sendFile(__dirname + '/HTML/search.html');
});

app.get('/search/:id/:query_string', function(req,res){
	var qString = "SELECT * FROM user WHERE fullname LIKE '%" + req.params.query_string + "%'";
    connection.query(qString, function(err,rows,fields){
        if(!err){
            res.send(rows);
        }
        else{
            console.log(err);
        }
    });
});
app.post('/edit-name/:newname',function(req,res){
	console.log(localStorage);
	console.log(req.params.newname);
	var qString ="UPDATE user SET fullname=\""+req.params.newname+"\" WHERE user_id =" + localStorage +";";
	connection.query(qString,function(err,rows,fields){
		if(!err){
			res.send(rows);
		}
		else{
			console.log(err);
		}
	});
});

app.listen(PORT);
console.log("Server started at localhost:" + PORT);