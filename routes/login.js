var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

/* GET login page. */
router.get('/', function(req, res) {
    res.render('theme/login',
        {
            title: 'Login',
            user: req.session.user
        });
});

/* Post to login page. */
router.post('/', function(req, res) {
    var service = new Service();
    service.getUser(req.body.userId,function(user)
    {
        service.close();
        req.session.user = user;
        res.redirect('/game');
        //res.redirect('/profile/'+req.session.user.id);
    });
});

module.exports = router;