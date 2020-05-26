var express = require('express');
var router = express.Router();
const travelList = require('../models').travelList;
const axios = require('axios');
var async = require("async");


router.get("/", function(req, res) {
    console.log("Get to Dashboard");
    console.log(req.user)
    travelList.findAll({
        where: {user_id: req.user}
    })
    .then(function (travelList){
        console.log("Line 35");
        var placeDetails = [];
        async.eachOf(travelList, function(item, i, callback){
            axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=AIzaSyDkevaDGz23RoPFkAmtHmOYQQQXwhnfS5E`)
                    .then(function(response){
                        response.data.result.travelList_id = item.id;
                        placeDetails.push(response.data);
                        console.log(placeDetails)
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
                console.log("Line 53");
                res.render("dashboard", {placeDetails: placeDetails})
            }
        })
    })
})


router.post("/delete/:id", (req, res) => {
    console.log(" req.params.id = " + req.params.id)
    travelList.destroy({
            where: {
               id : req.params.id
            }
        }).then(function (resp) {
            console.log(resp)
            res.redirect('/dashboard');
        })
        .catch(err => {
            res.status(401).json(err);
        });
});



module.exports = router;