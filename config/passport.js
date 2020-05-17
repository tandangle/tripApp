// const LocalStrategy = require('passport-local').Strategy;
// const bycrypt = require('bcrypt');

//load user model
// const User = require('../models').User;

// module.export = function(passport) {
// passport.use(
//     new LocalStrategy({ userNameField: 'email' }, (email, password, done) => {
//         //match user
//         User.findOne({ email: email })
//             .then(user => {
//                 if (!user) {
//                     return done(null, false, { msg: 'that email not registered' })
//                 }

//                 //Match password
//                 bycrypt.compare(password, user.password, (err, isMatch) => {
//                     if (err) throw err;
//                     if (isMatch) {
//                         return done(null, user)
//                     } else {
//                         return done(null, false, { msg: 'Password incorrect' });
//                     }
//                 })
//             })
//             .catch(err => console.log(err))
//     })
// );
// passport.serializeUser(function(user, done) {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//         done(err, user)
//     })
// });

// }