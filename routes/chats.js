/**
 * Created by Ahmed on 3/5/2016.
 */
var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

router.get('/', function(req, res, next) {
    if(req.session.user)
    {
        var service = new Service();
        service.getChats(req.session.user.id,
            function(chats)
            {
                res.render('chats',
                    {
                        chats: chats,
                        user: req.session.user
                    })
                service.close();
            });
    }
    else
    {
        res.redirect('/');
    }
});



module.exports = router;
