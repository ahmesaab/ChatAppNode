var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('theme/home',
        {
          title: 'Home',
          user: req.session.user
        });

});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('theme/login',
        {
          title: 'Login',
          user: req.session.user
        });
});

/* GET login page. */
router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.render('theme/home',
        {
            title: 'Home'
        });
});


router.post('/login', function(req, res, next) {
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
