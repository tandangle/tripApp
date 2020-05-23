
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('../config/passport');
const User = require('../models').User;
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy; 




// /* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login');
});


router.post('/', function(req, res) {
    User
        .findOne({
          where: {
            email: req.body.email
          }
        })
        .then((user) => {
          if (!user) {
            return res.status(401).send({
              message: 'Authentication failed. User not found.',
            });
          }
          user.comparePassword(req.body.password, (err, isMatch) => {
            if(isMatch && !err) {
              var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
              jwt.verify(token, 'nodeauthsecret', function(err, data){
                
                console.log(err, data);
              })
               // res.redirect('/')
               
              res.json({success: true, token: 'JWT ' + token});
            } else {
                // res.redirect('/login')

              res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
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
