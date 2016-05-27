/**
 * Created by Ahmed on 4/12/2016.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('home',
        {
            title: 'Home',
            user: req.session.user
        });

});

module.exports = router;
