var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport')
const db = require('./models')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var travelListRouter = require('./routes/map')
require('./config/passport')

var app = express();

const users = []
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//
passport.serializeUser(function(user, done) {
    done(null, user.id);
});


passport.deserializeUser((id, done) => {
    db.user.findAll({ raw: true, where: { id: id } })
        .then((err, user) => {
            done(err, user[0])
        });
});

app.use(function(req,res,next ){
    console.log(req.isAuthenticated());
    if(req.path === "/login" || req.path === "/register" || req.path === "/"){
        return next()
    } else if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect("/login")
    }
})

//initialize passport
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/map', travelListRouter)





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