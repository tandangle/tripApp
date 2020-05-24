var express = require('express');
var router = express.Router();
const travelList = require('../models').travelList;
const axios = require('axios');

/* GET users listing. */
// router.get("/", function(req, res, next) {
//     console.log(req.isAuthenticated());
//     res.render("dashboard")
// });

router.get("/", function(req, res) {
    console.log("Get to Dashboard");
    console.log(req.user)
    travelList.findAll({
        where: {user_id: req.user}
    })
    .then(function (travelList){
        console.log(travelList);
        travelList.forEach(function(item) {
            axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=AIzaSyDkevaDGz23RoPFkAmtHmOYQQQXwhnfS5E`)
            .then(function(response){
                console.log(response.data);
                placeDetails.push(response.data)
            })
            .catch(function(error){
                console.log(error)
            })
        })
        console.log(placeDetails);
        console.log(req.user.firstName);
        res.render("dashboard", {user: req.user.firstName, placeDetails: placeDetails})
    })
})

module.exports = router;