/**
 * Created by Ahmed on 4/12/2016.
 */
var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

/* Destroy session, update user status to offline, and redirect to home page */
router.get('/', function(req, res, next) {
    if(req.session.passport) {
        var service = new Service();
        service.disconnectUser(req.session.passport.user);
        req.session.destroy();
    }
    res.redirect('/');
});

module.exports = router;