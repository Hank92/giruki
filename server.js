var request = require('request'),
	cheerio = require('cheerio'),
	express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	flash = require('connect-flash'),
	methodOverride = require('method-override');

	morgan = require('morgan'),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	session      = require('express-session');
	mongoosePaginate = require('mongoose-paginate');

//configuration//
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

require('./config/passport')(passport); // pass passport for configuration

	app.use(express.static(path.normalize(__dirname) + '/views'))
	app.use(morgan('dev')); // log every request to the console
	app.use(bodyParser());// pull information from html in POST
	app.use(bodyParser.json());	 //setting app to use bodyParser
	app.use(bodyParser.urlencoded());
	app.use(cookieParser());
	app.use(methodOverride());

	app.use(session({ secret: 'iloveyousomuchtodeath' })); // session secret	app.use(passport.initialize());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	app.set('views', path.normalize(__dirname) + '/views/html');
	app.set('view engine', 'html')
	app.set('view engine', 'ejs'); //set up ejs for templating

// routes ======================================================================
require('./app/routes.js')(app,passport); // load our routes and pass in our app

//start the server
app.listen(3000, function(){
	console.log('Its running');
})