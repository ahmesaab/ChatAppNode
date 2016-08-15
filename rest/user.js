/**
 * Created by Ahmed on 8/15/2016.
 */
var express = require('express');
var Service = require('../data/service.js');
var router = express.Router();

router.get('/', function(req, res) {
    var service = new Service();
    service.getUser(req.query.id, function(user){
        if(user==null)
            res.sendStatus(500);
        else
            res.send(user);
    });
});

module.exports = router;