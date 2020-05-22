
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const passport = require('../config/passport');
const User = require('../models').User;



// /* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login');
});


router.get('/auth', passport.authenticate('jwt', { session: false }),
    function(req, res) {
      res.redirect('users')
    }
);

router.post('/', function(req, res) {
    User
        .findOne({
          where: {
            email: req.body.email
          }
        })
        .then((user) => {
          if (!user) {
            res.render('login', {error: 'Authentication failed. User not found.'})

          }
          user.comparePassword(req.body.password, (err, isMatch) => {
            if(isMatch && !err) {
              var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
              jwt.verify(token, 'nodeauthsecret', function(err, data){
                
                console.log(err, data);
              })
              res.cookie('token', token, {maxAge: 60 * 1000 * 5, secure: false})
              res.redirect('/login/auth')

        //  res.json({success: true, token: 'JWT ' + token});
            } else {
                 res.render('login', {error: 'Authentication failed. Wrong password.'})
            }
          })
        })
        .catch((error) => res.status(400).send(error));
  });


  getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  
module.exports = router;
