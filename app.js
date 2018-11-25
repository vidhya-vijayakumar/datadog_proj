var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./app-server/routes/index');
var app = express();
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo')(session);

// View engine setup
// Load View Engine
app.engine('pug', require('pug').__express)
app.set('views', path.join(__dirname, '/app-server/views'));
app.set('view engine', 'pug');

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true})); 
app.use(methodOverride('_method'));

// Configuring the database
const dbConfig = require('./config/database');

mongoose.Promise = global.Promise;
const db = mongoose.connection

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Public folder
app.use(express.static(path.join(__dirname,'public')));

// Express Session Middleware
app.use(session({
  secret: 'String for session',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: db })
}));

// Express Messages Middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  res.locals.error = req.flash('error');
  next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));
  
// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

app.use('/', index);

let users = require('./app-server/routes/users');
app.use('/users', users);

module.exports = app;
require('./app-server/routes/note.routes.js')(app);
app.listen(3000);