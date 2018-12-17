// Requiring necessary npm middleware packages 
var express = require("express");
var path = require('path');
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("./config/passport");
// Setting up port
var PORT = process.env.PORT || 8080;
// Creating express app and configuring middleware 
//needed to read through our public folder
var db = require("./models");

var app = express();

// view engine setup careful
app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: false })); //For body parser
app.use(bodyParser.json());
app.use(express.static("public"));
//
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
//
// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
//
//this will listen to and show all activities on our terminal to 
//let us know what is happening in our app
db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("==> ? Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
	});
});
