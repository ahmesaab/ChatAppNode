/**
 * Created by Ahmed on 3/6/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if(req.session.user)
    {
        res.render('game',
            {
                user: req.session.user,
                title: 'Game of Life'
            })
    }
    else
    {
        res.redirect('/');
    }
});

module.exports = router;