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
var loginRouter = require('./routes/login');
var googleRouter = require('./routes/google');
require('./config/passport')
const cookieSession = require('cookie-session')

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

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Google strategy 
app.use(cookieSession({
    name: 'travelapp-session',
    keys: ['key1', 'key2']
  }))

app.use(passport.initialize());
app.use(passport.session());

app.get('/error', (req, res) => res.redirect("/error"))
app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => res.redirect("/"))

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));


app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/redirect');
  });


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/google', googleRouter);





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