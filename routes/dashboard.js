var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get("/", function(req, res, next) {
//     console.log(req.isAuthenticated());
//     res.render("dashboard")
// });

router.get(function(req,res,next) {
    travelList.findAll({
        where: {user_id: req.user_id}
    })
    .then(function (travelList){
        res.render("dashboard", {user: req.user.firstName, travelList: travelList})
    })
})

module.exports = router;