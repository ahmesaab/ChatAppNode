var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

/* GET login page. */
router.get('/', function(req, res) {
    res.render('login',
        {
            title: 'Login',
            navigationLinks: {'Sign up':'/signup'}
        });
});

/* Post to login page. */
router.post('/', function(req, res) {
    var service = new Service();
    service.getUser(req.body.userId,function(user)
    {
        if(user!=null)
        {
            req.session.passport ={'user': user.id};
            res.redirect('/game');
            //res.redirect('/profile/'+req.session.user.id);
        }
        else
        {
            res.render('login',
                {
                    title: 'Login',
                    navigationLinks: {'Sign up':'/signup'},
                    error: 'Email or password is Incorrect'
                });
        }
    });
});

module.exports = router;