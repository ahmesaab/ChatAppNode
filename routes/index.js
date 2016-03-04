var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ChatApp' });
});

router.post('/', function(req, res, next) {
  req.session.userId = req.body.userId;
  res.redirect('/user/'+req.session.userId);
});

module.exports = router;
