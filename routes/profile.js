/**
 * Created by Ahmed on 3/8/2016.
 */
var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

router.get('/:id', function(req, res, next) {
    var service = new Service();
    service.getUser(req.param("id"),function(user){
        service.getUsers(function(users)
        {
            res.render('profile', {
                profileUser: user,
                users: users,
                user: req.session.user
            })
            service.close();
        })
    });
});

module.exports = router;
