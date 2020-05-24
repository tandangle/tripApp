var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport')
const flash = require("express-flash");
const session = require("express-session");
const db = require('./models')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var mapRouter = require('./routes/map')
var dashboardRouter = require('./routes/dashboard')
require('./config/passport')

var app = express();

const User = require('./models').User;
const users = []
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(
    session({
      // Key we want to keep secret which will encrypt all of our information
      secret: "keyboard cat",
      // Should we resave our session variables if nothing has changes which we dont
      resave: false,
      // Save empty value if there is no vaue which we do not want to do
      saveUninitialized: false
    })
  );
  // Funtion inside passport which initializes passport
app.use(passport.initialize());
  // Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());

app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// restrict unauthenticated users from accesing pages other than login/register pages
app.use(function(req,res,next ){
    if(req.path === "/login" || req.path === "/register"){
        return next()
    } else if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect("/login")
    }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', loginRouter);
app.use('/map', mapRouter)
app.use('/dashboard', dashboardRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;