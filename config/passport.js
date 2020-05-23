
const JwtStrategy = require('passport-jwt').Strategy
const passport  = require('passport')


//load up the user model
const User = require('../models').User;


var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    console.log(token);
    return token;
};


  const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: 'nodeauthsecret',
  };
  passport.use('jwt', new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("line 25" + User);
    User
      .findByPk(jwt_payload.id)
      .then((user) => { return done(null, user); })
      .catch((error) => { return done(error, false); });
  }));

module.exports = passport
// ...
