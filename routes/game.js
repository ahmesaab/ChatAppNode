/**
 * Created by Ahmed on 3/6/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if(req.session.user)
    {
        res.render('pokemon-chat-2',
            {
                user: req.session.user,
                title: 'Game of Life'
            })
    }
    else
    {
        res.send(403);
    }
});

module.exports = router;