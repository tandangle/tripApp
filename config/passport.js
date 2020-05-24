const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");

//load up the user model
const User = require('../models').User;

  passport.use(new LocalStrategy({
    usernameField: 'email'
  },
    function (email, password, done) {
      console.log("Made it to localstrategy")
      User.findOne({ raw: true, where: { email: email } })
        .then(function (user) {
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
              console.log(err);
              return done(null, false, { message: 'Error authenticating login' });
            } else if (result == true) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Incorrect password" })
            }
          });
        })
    }
  ));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});


passport.deserializeUser((id, done) => {
    User.findOne({ raw: true, where: { id: id } })
        .then((err, user) => {
            console.log(err);
            console.log(user);
            done(err, user)
        });
});



module.exports = passport;
