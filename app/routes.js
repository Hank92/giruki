// app/routes.js

var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var	methodOverride = require('method-override');


var postModel = require('../app/models/post');

module.exports = function (app, passport){

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

app.get('/humor_boarddelete', function (req, res){
	postModel.find({}, function(req, docs){
		res.render('humor_boardDelete', {postModels: docs})	
	})
	
})


app.get('/humor_boarddelete/:id/delete', function(req, res){
	postModel.remove({_id: req.params.id}, 
	   function(err){
		if(err) res.json(err);
		else    res.redirect('/humor_boarddelete');
	});
});

app.delete('/humor_boarddelete/:id', function(req, res){
      postModel.remove({_id: req.params.id}, function(err, docs) {
		if (err) res.json(err);
		else     res.redirect('/humor_board')
			})//incheonPost.remove
   		
   })

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

	

app.get('/search',  function(req, res) {
	console.log("Query: " + req.query);
	if (req.query.search) {
		postModel.findByTitle(req.query.search, function(err, all_posts) {
			console.log("Pins: " + JSON.stringify(all_posts) );
			res.render('humor_board', { postmodels: all_posts }, function(err, html) {
				res.send(html);
			})
			// res.send(JSON.stringify(result))
		});
	} else {
		postModel.find({}, function(err, all_pins) {
			console.log("Pins: " + JSON.stringify(all_pins) );
			res.render('humor_board', { postModels: all_pins }, function(err, html) {
				res.send(html);
			})
			// res.send(JSON.stringify(result))
		});
	}
})


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
/*
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
					if( image_url != null)
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
*/
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


request('http://ggulbam36.com/Picture', function(err, res, body){
	
	if(!err && res.statusCode == 200) {
		
		var $ = cheerio.load(body);
		$('.bd_lst li').each(function(){
		var ggulTitle = $(this).find('p b').text();
		var newHref = $(this).find('a').attr('href');
		var ggulUrl = "http://ggulbam36.com"+ newHref;
	 	
			request(ggulUrl, function(err, res, body){
				if(!err && res.statusCode == 200) {
				var $ = cheerio.load(body);
				var image_url = [];

				$('article div p img').each(function(){
					var img_url = $(this).attr('src');
					image_url.push(img_url);	
				})


				// scrape all the images for the post
				postModel.find({title: ggulTitle}, function(err, newPosts){
				
				if (!newPosts.length){
					//save data in Mongodb

					var Post = new postModel({
						title: ggulTitle,
						url: ggulUrl,
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