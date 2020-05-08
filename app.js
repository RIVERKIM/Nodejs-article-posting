// Middle ware: body-parser, express-session, express-validator, express-messages, connect-flash
// bcrpyt.js
const express = require("express");
const path = require('path');
const mongoose = require('mongoose'); // MongoD	+B ODM(Object Document Mapping) 즉 문서를 db에서 조회할 때 js 객체로 바꿔준다.
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const {userValidationRules, validate} = require('./validator/validator.js');
const config = require('./config/database.js');


mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;

// Check connection
db.once('open', () => {
	console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', (err) => {
	console.log(err);
});

//Init app
const app = express();
// Bring in models
let Article = require('./models/articles');

// Load View Engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname, 'static')));

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
cookie: { maxAge: 60000 }
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
	res.locals.user = req.user || null;
	next();
})

//Home Route
app.get('/', (req, res) => {
	Article.find({}, function(err, articles) {
		if(err) {
			console.log(err);
		} else {
			res.render('index', {
			title: "Articles",
			articles: articles
			});	
		}
	});
});

// Route Files
let articles = require('./routes/articles.js');
let users = require('./routes/users.js');

app.use('/articles', articles);
app.use('/users', users);
// Start Server
app.listen(3000, function() {
	console.log('Server started on port 3000 .....');
});