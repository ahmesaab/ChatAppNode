/**
 * Created by Ahmed on 4/12/2016.
 */
var express = require('express');
var router = express.Router();

/* Destroy session and render home page */
router.get('/', function(req, res, next) {
    req.session.destroy();
    res.render('home',
        {
            title: 'Home'
        });
});

module.exports = router;