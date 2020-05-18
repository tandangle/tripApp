const LocalStrategy = require('passport-local').Strategy;
const bycrypt = require('bcryptjs');

//load user model
const db = require('../models');
// const db = require('../models/user');

module.export =
    new LocalStrategy({ userNameField: 'email' }, (email, password, done) => {
        //match user
        db.user.findOne({ where: { email: email } })
            .then(user => {
                if (!user) {
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
    });