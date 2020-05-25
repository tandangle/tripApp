var express = require('express');
var router = express.Router();
const travelList = require('../models').travelList;
const axios = require('axios');
var async = require("async");

/* GET users listing. */
// router.get("/", function(req, res, next) {
//     console.log(req.isAuthenticated());
//     res.render("dashboard")
// });

router.get("/", function(req, res) {
    console.log("Get to Dashboard");
    console.log(req.user)
    travelList.findAll({
<<<<<<< HEAD
        where: {Users_id: req.Users_id}
    })
    .then(function (travelLists){
        res.render('dashboard', {Users: req.Users.firstName, travelLists: travelLists})
=======
        where: {user_id: req.user}
    })
    // .then(async function (travelList){
    //     console.log(travelList);
    //     placeDetails = [];
    //     for await (let item of travelList){
    //         axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=AIzaSyDkevaDGz23RoPFkAmtHmOYQQQXwhnfS5E`)
    //         .then(function(response){
    //             placeDetails.push(response.data)
    //         })
    //         .catch(function(error){
    //             console.log(error)
    //         })
    //     }
    //     console.log(placeDetails);
    //     res.render("dashboard", {placeDetails: placeDetails})
    // })
    .then(function (travelList){
        console.log("Line 35");
        var placeDetails = [];
        async.each(travelList, function(item, callback){
            axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=AIzaSyDkevaDGz23RoPFkAmtHmOYQQQXwhnfS5E`)
                    .then(function(response){
                        placeDetails.push(response.data);
                        callback(null)
                    })
                    .catch(function(error){
                        console.log(error);
                        callback(err)
                    })
        }, function(err){
            if(err) {
                console.log("line 49")
                console.log(err)
            } else {
                console.log(placeDetails);
                console.log("Line 53");
                res.render("dashboard", {placeDetails: placeDetails})
            }
        })
>>>>>>> origin/tan-dashboard
    })
})

module.exports = router;