require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require('bcrypt');

// Database setup
const db = require("./config/connection");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// express-session
app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false,
  store: new session.MemoryStore
}));

// passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  db.query("SELECT * FROM users WHERE id = " + id, function (err, rows) {
    done(err, rows[0]);
  });
});

passport.use(
  'local-login',
  new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      db.query("SELECT * FROM users WHERE email = ?", [email],
        (err, rows) => {
          if (err)
            return done(err);
          if (!rows.length) {
            return done(null, false, req.flash('error', 'Používateľ so zadanou e-mailovou adresou neexistuje. '));
          }
          if (!bcrypt.compareSync(password, rows[0].password))
            return done(null, false, req.flash('error', 'Zadali ste nesprávne heslo. '));

          return done(null, rows[0]);
        });
    })
);

// flash messages
app.use(flash());

// database - create a DB
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE IF NOT EXISTS reflexdata";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Database created!");
  })
});

app.get("/createproductstable", (req, res) => {
  let sql = "CREATE TABLE IF NOT EXISTS products (id INT(5) NOT NULL AUTO_INCREMENT PRIMARY KEY, product_category VARCHAR(255) NOT NULL, product_category_hu VARCHAR(255) NOT NULL, product_name VARCHAR(30) NOT NULL, product_name_hu VARCHAR(30) NOT NULL, product_detail VARCHAR(255) NOT NULL, product_detail_hu VARCHAR(255) NOT NULL, product_area INT, product_location VARCHAR(50) NOT NULL, product_location_hu VARCHAR(50) NOT NULL, product_price VARCHAR(50) NOT NULL, product_price_hu VARCHAR(50) NOT NULL, imageURL VARCHAR(1000), imageID VARCHAR(1000), date_of_creation DATE NOT NULL)";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Products table created...");
  });
});

// local variables
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.url = req.path;
  res.locals.flash = req.flash();
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;