var express = require('express');
var router = express.Router();
const User = require('../models').User;


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('register');
});

router.post('/', async(req, res) => {
    console.log(req.body);
    let results = await User.findAll({
        raw: true,
        where: {
            email: req.body.email
        }
    })
    if (results[0]) {
        res.render('register', { error: 'Email already in use' })
    } else {
        User
            .create({
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                email: req.body.email,
                password: req.body.password
            })
            .then((user) =>
                res.render('register', { error: `${req.body.lastName} Registered Successfully!` }))
            .catch((error) => {
                console.log(error);
                res.status(400).send(error);
            });
    }
});
module.exports = router;