var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',
      {
        title: 'ChatApp',
        user: req.session.user
      });
});

router.post('/', function(req, res, next) {
    var service = new Service();
    service.getUser(req.body.userId,function(user)
    {
        service.close();
        req.session.user = user;
        res.redirect('/profile/'+req.session.user.id);
    });
});

module.exports = router;
