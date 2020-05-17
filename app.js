var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bcrypt = require('bcrypt');
var passport = require('passport');
var flash = require('express-flash');
var session = require('express-session');
// const LocalStrategy = require('./config/passport.js')
const db = require('./models')
var LocalStrategy = require('passport-local').Strategy;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
// require('./config/passport')(passport);
const User = require('./models').User;
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
//session 
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
//initialize passport
app.use(passport.initialize());
app.use(passport.session());
// flash middleware
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

passport.use(
    new LocalStrategy({ userNameField: 'email' }, (email, password, done) => {
        //match user
        User.findOne({ raw: true, where: { email: email } })
            .then(user => {
                console.log(user)
                if (!user[0]) {
                    return done(null, false, { msg: 'that email not registered' })
                }

                //Match password
                bycrypt.compare(password, user[0].password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, { msg: 'Password incorrect' });
                    }
                })
            })
            .catch(err => console.log(err))
    })
);
passport.serializeUser(function(user, done) {
    done(null, user[0].id);
});

passport.deserializeUser((id, done) => {
    User.findOne({ raw: true, where: { id: id } }, (err, user) => {
        done(err, user[0])
    });
});

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