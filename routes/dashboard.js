var express = require('express');
var router = express.Router();

const travelList = require('../models').travelList;



router.get(function(req,res,next) {
    travelList.findAll({
        where: {user_id: req.user_id}
    })
    .then(function (travelList){
        res.render("dashboard", {user: req.user.firstName, travelList: travelList})
    })
})