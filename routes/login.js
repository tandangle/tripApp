
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models').User;
const passport = require('../config/passport');



// /* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login');
});


router.post('/', passport.authenticate("local", {
  successRedirect: "/map",
  failureRedirect: "/login",
  failureFlash: true
})
);

module.exports = router;
