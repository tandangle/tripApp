var express = require('express');
var router = express.Router();
const travelList = require('../models').travelList;

/* GET users listing. */
router.get("/", function(req, res, next) {
    console.log("Console logging authenticated from insinde of map.js" + req.isAuthenticated());
    res.render("map")
});

router.post('/travel_list/:place_id', async function(req, res) {
    console.log(req.params.place_id);
    await travelList.findOne({
        where: {user_id: req.user,
                place_id: req.params.place_id}
    })
    .then(function(result){
        if(!result) {
    travelList.create(({user_id: req.user, place_id: req.params.place_id}))
    .then(function(result){
        console.log(result)
    })
    .catch(function(e){
        console.log(e)
    })
        }
    })
    
});

module.exports = router;