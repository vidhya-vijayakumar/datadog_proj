var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./app-server/routes/index');
var app = express();

//View engine setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true})); 
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
app.use(express.static(path.join(__dirname,'public')));
app.use(session( {secret:"String for encrypting cookies."} ));
app.use('/', index);

module.exports = app;
require('./app-server/routes/note.routes.js')(app);
app.listen(3000);