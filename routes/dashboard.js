var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get("/", function(req, res, next) {
//     console.log(req.isAuthenticated());
//     res.render("dashboard")
// });

router.get(function(req,res,next) {
    travelList.findAll({
        where: {Users_id: req.Users_id}
    })
    .then(function (travelLists){
        res.render('dashboard', {Users: req.Users.firstName, travelLists: travelLists})
    })
})

module.exports = router;