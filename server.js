var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var DbEditor = require('./js_backend/DbManipulator');
var Schema = require('./js_backend/Schema');

var app = express();
var cors = require('cors');

passport.use(new LocalStrategy(function(username, password, done) {
  console.log("passport" + username);
  DbEditor.query(Schema.User.table, ['*'], [Schema.User.column.username+'='], ['\''+username+'\''], function(err, rows){
    console.log(err);
    console.log(rows);
    if(rows.length === 0){
      return done(null, false, {message: 'Invalid username or password'});
    }

    var hashed = rows[0].password;
    if(bcrypt.compareSync(password, hashed)){
      return done(null, rows[0]);
    } else {
      return done(null, false, {message: 'Invalid username or password'});
    }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  var q = "select * from tbl_users where username=\'" + username + "\'";
  console.log(q);
  DbEditor.rawQuery(q, function(err,rows){
    console.log(err);
    console.log(rows.length);

    done(err, rows[0]);
  });
});

app.use(cors());
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({secret: 'secret strategic abcde code'}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/bower_components', express.static(path.join(__dirname, './bower_components')));
app.use('/js', express.static(path.join(__dirname, './js')));
app.use('/css', express.static(path.join(__dirname, './css')));
app.use('/images', express.static(path.join(__dirname, './images')));
app.use('/node_modules', express.static(path.join(__dirname, './node_modules')));
app.use('/views', express.static(path.join(__dirname, './views')));


require('./routes-api')(app, passport);
require('./routes')(app, passport);




app.listen(8889, function(err){
  if(!err) console.log('Server is running');
  else console.log(err);
});
