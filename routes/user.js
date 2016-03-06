var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

router.get('/:id', function(req, res, next) {
  var service = new Service();
  service.getPerson(req.param("id"),function(person){
    service.getUsers(function(users)
    {
      res.render('profile', {
        user: person,
        users: users,
        userID: req.session.userId
      })
      service.close();
    })
  });
});

module.exports = router;
