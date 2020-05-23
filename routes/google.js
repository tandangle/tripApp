const express = require('express');
const router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

router.get('/', function(req, res, next) {
    res.render('login');
});


passport.use(new GoogleStrategy({
    clientID: "693700497823-2hoiigio1u20uok1v25c9hf2dat5cb1f.apps.googleusercontent.com",
    clientSecret: "Wpdut5RWHS40syuKKXnQ9X3k",
    callbackURL: "http://localhost:3000/auth/google/redirect"
  }, (accessToken, refreshToken, profile, done) => {
      console.log('passport callback function fired');
      console.log(profile); 
  })
);

  /*
  function(accessToken, refreshToken, profile, done) {
    console.log(Users);
    // Query the database to find user record associated with this
    // google profile, then pass that object to done callback
    db.findUserById(Users.id).then(function(id) {
      if (id) {
        return done(null, User);
      } else {
        db.createUser(User.id)
          .then(function(id) {
            return done(null, User);
          });
      }
    });
  })
);
*/

 /* 
  function(accessToken, refreshToken, profile, done) {
      // use profile info to check if user is registered in db. 
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));
*/

/*
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
  passport.deserializeUser(function(id, done) {
      done(null, obj);
});
*/

/*
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));


app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/users');
  });
*/

module.exports = router;