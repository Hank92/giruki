// app/routes.js

var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var	methodOverride = require('method-override');


var postModel = require('../app/models/post');
var incheonPost = require('../app/models/incheonAirportPost');
var free_boardPost = require('../app/models/free_boardPost');

module.exports = function (app, passport){

app.get('/apkrMain', function (req, res){
	var currentPage = 1;
	if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
    	}
			postModel.paginate({}, {sort: {"_id":-1}, page: currentPage, limit: 13 }, function(err, results) {
         if(err){
         console.log("error");
         console.log(err);
     } else {
    	    pageSize = results.limit;
            pageCount = (results.total)/(results.limit);
    		pageCount = Math.ceil(pageCount);
    	    totalPosts = results.total;
    	console.log(results.docs)

    	res.render('apkrMain.ejs', {
    		postModels: results.docs,
    		pageSize: pageSize,
    		pageCount: pageCount,
    		totalPosts: totalPosts,
    		currentPage: currentPage
    	})//res.render
     }//else
     });//paginate
	
});

app.get('/apkrMain/:id', function(req, res){
	var postId = req.postId;
	postId.userComments.push({ userPost: req.query.userPost});
	postId.save();
	res.render('individualAPKR.ejs', {postModel: postId});
	console.log(postId)//finds the matching object
});

app.post('/apkrMain/:id', function (req, res){
	postModel.find({_id: req.params.id}, function(err, item){
		if(err) return next("error finding blog post.");
		item[0].userComments.push({userPost : req.body.userPost})
		item[0].save(function(err, data){
			if (err) res.send(err)
			else res.redirect('/apkrMain/' + req.params.id)
		});
	})

}) //app.post 

app.param('id', function(req, res, next, id){
	postModel.findById(id, function(err, docs){
		if(err) res.json(err);
		else
			{
				req.postId = docs;
				next();
			}
			});	
});

app.param('id', function(req, res, next, id){
	free_boardPost.findById(id, function(err, docs){
		if(err) res.json(err);
		else
			{
				req.postIds = docs;
				next();
			}
			});	
});

app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

//logout
app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

 app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// process the login form
app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/success', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

app.get('/humor_board/:id', function(req, res){
	var postId = req.postId;
	postId.userComments.push({ userPost: req.query.userPost});
	postId.save();
	res.render('individualHumor_Board.ejs', {postModel: postId});
	console.log(postId)//finds the matching object
});


//post a comment on humor board
app.post('/humor_board/:id', function (req, res){
	postModel.find({_id: req.params.id}, function(err, item){
		if(err) return next("error finding blog post.");
		item[0].userComments.push({userPost : req.body.userPost})
		item[0].save(function(err, data){
			if (err) res.send(err)
			else res.redirect('/humor_board/' + req.params.id)
		});
	})

}) //app.post  

app.get('/free_board', function (req, res){
	var currentPage = 1;
	if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
    	}
		free_boardPost.paginate({}, {sort: {"_id":-1}, page: currentPage, limit: 13 }, function(err, results) {
         if(err){
         console.log("error");
         console.log(err);
     } else {
    	    pageSize = results.limit;
            pageCount = (results.total)/(results.limit);
    		pageCount = Math.ceil(pageCount);
    	    totalPosts = results.total;
    	console.log(results.docs)
    	res.render('free_board.ejs', {  
    		free_boardPosts: results.docs,
    		pageSize: pageSize,
    		pageCount: pageCount,
    		totalPosts: totalPosts,
    		currentPage: currentPage
    	})//res.render
    	
     }//else
     });//paginate
});

app.get('/free_boards', isLoggedIn, function(req,res){
	var currentPage = 1;
	if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
    	}
		free_boardPost.paginate({}, {sort: {"_id":-1}, page: currentPage, limit: 10 }, function(err, results) {
         if(err){
         console.log("error");
         console.log(err);
     } else {
    	    pageSize = results.limit;
            pageCount = (results.total)/(results.limit);
    		pageCount = Math.ceil(pageCount);
    	    totalPosts = results.total;
    	console.log(results.docs)
    	res.render('free_boards.ejs', {  
    		user: req.user,  	
    		free_boardPosts: results.docs,
    		pageSize: pageSize,
    		pageCount: pageCount,
    		totalPosts: totalPosts,
    		currentPage: currentPage
    	})//res.render
    	console.log(req.user)
     }//else
     });//paginate
})


app.get('/free_board/:id', function(req, res){
	var postId = req.postIds ;
	postId.freeBoardComments.push({ userBoardPost: req.query.userBoardPost});
	postId.save();
	res.render('individualfree_Board.ejs', {post: postId});
	console.log(postId)//finds the matching object
});

app.post('/free_board/:id', isLoggedIn, function (req, res){
	free_boardPost.find({_id: req.params.id}, function(err, item){
		if(err) return next("error finding blog post.");
		item[0].userComments.push({userBoardPost : req.body.userBoardPost})
		item[0].save(function(err, data){
			if (err) res.send(err)
			else res.redirect('/free_board/' + req.params.id)
		});
	})

}) //app.post  

app.post('/free_board', isLoggedIn, function (req, res){
	var newfree_boardPost = new free_boardPost ({
		title: req.body.title,
		text: req.body.text,
		nickname: req.body.nickname
		
	});
	newfree_boardPost.save(function(err){
		if(err){
			console.log("error!")
			res.send(err)
		}
		else{
			res.redirect('/free_board')
		}
	});
});



app.get('/humor_board', function (req, res){
	var currentPage = 1;
	if (typeof req.query.page !== 'undefined') {
        currentPage = +req.query.page;
    	}
			postModel.paginate({}, {sort: {"_id":-1}, page: currentPage, limit: 9 }, function(err, results) {
         if(err){
         console.log("error");
         console.log(err);
     } else {
    	    pageSize = results.limit;
            pageCount = (results.total)/(results.limit);
    		pageCount = Math.ceil(pageCount);
    	    totalPosts = results.total;
    	console.log(results.docs)

    	res.render('humor_board.ejs', {
    		postModels: results.docs,
    		pageSize: pageSize,
    		pageCount: pageCount,
    		totalPosts: totalPosts,
    		currentPage: currentPage
    	})//res.render
     }//else
     });//paginate
	
});
};


request('http://bhu.co.kr/bbs/board.php?bo_table=best&page=1', function(err, res, body){
	
	if(!err && res.statusCode == 200) {
		
		var $ = cheerio.load(body);
		$('td.subject').each(function(){
		var bhuTitle = $(this).find('a font').text();
		var newHref = $(this).find('a').attr('href');
		newHref = newHref.replace("≀","&");
		newHref = newHref.replace("id","wr_id");
		newHref = newHref.replace("..",".");
		var bhuUrl = "http://www.bhu.co.kr"+ newHref;
	 	
			request(bhuUrl, function(err, res, body){
				if(!err && res.statusCode == 200) {
				var $ = cheerio.load(body);
				var comments = [];
				var image_url = [];

				$('span div img').each(function(){
					var img_url = $(this).attr('src');
					image_url.push(img_url);	
				})
				// scrape all the images for the post
				
					$("[style *= 'line-height: 180%']").each(function(){
						var content =  $(this).text();
							comments.push({content: content}); 	
					})//scrape all the comments for the post

					comments.splice(0,1)

			postModel.find({title: bhuTitle}, function(err, newPosts){
				
				if (!newPosts.length){
					//save data in Mongodb

					var Post = new postModel({
						title: bhuTitle,
						url: bhuUrl,
						image_url: image_url,
						comments: comments
					})
			Post.save(function(error){
					if(error){
						console.log(error);
					}
					else 
						console.log(Post);
				})

			//post.save
				}//if bhuTitle안에 있는 {}

			})//postModel.find
			

			}//if문

			})//request

			
		});
		
	}//첫 if구문

});

request('http://issuein.com/', function(err, res, body){
	
	if(!err && res.statusCode == 200) {
		
		var $ = cheerio.load(body);
		$('td.title').each(function(){
		var issueTitle = $(this).find('a.hx').text();
		var newHref = $(this).find('a').attr('href');
		var issueUrl = "http://www.issuein.com"+ newHref;
	 	
			request(issueUrl, function(err, res, body){
				if(!err && res.statusCode == 200) {
				var $ = cheerio.load(body);
				var image_url = [];

				$('article div img').each(function(){
					var img_url = $(this).attr('src');
					image_url.push(img_url);	
				})


				// scrape all the images for the post
				postModel.find({title: issueTitle}, function(err, newPosts){
				
				if (!newPosts.length){
					//save data in Mongodb

					var Post = new postModel({
						title: issueTitle,
						url: issueUrl,
						image_url: image_url
					
					})
			Post.save(function(error){
					if(error){
						console.log(error);
					}
					else 
						console.log(Post);
				})

			//post.save
				}//if bhuTitle안에 있는 {}

			})//postModel.find
			

			}//if문

			})//request

			
		});
		
	}//첫 if구문

});




// route middleware to make sure a user is logged in to post on humor board
function isLoggedInToPost(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/humor_board/' + req.params.id);
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
// route middleware to make sure a user is logged in
function isLoggedInIncheonAirport(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}