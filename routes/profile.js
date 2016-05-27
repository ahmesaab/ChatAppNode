/**
 * Created by Ahmed on 3/8/2016.
 */
var express = require('express');
var router = express.Router();
var serviceBuilder = require('../data/service.js');

router.get('/:id', function(req, res, next) {
    var service = new(serviceBuilder)();
    service.getUser(req.param("id"),function(user){
        service.getUsers(function(users)
        {
            res.render('profile', {
                profileUser: user,
                users: users,
                userId: req.session.passport ? req.session.passport.user:null,
                navigationLinks: {'Play':'/game','Logout':'/logout'}
            })
        })
    });
});

module.exports = router;
