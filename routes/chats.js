/**
 * Created by Ahmed on 3/5/2016.
 */
var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

router.get('/', function(req, res, next) {
    var currentUserID=req.session.userId;
    if(currentUserID)
    {
        var service = new Service();
        service.getChats(currentUserID,
            function(chats)
            {
                res.render('chats',
                    {
                        chats: chats,
                        userID: req.session.userId
                    })
                service.close();
            });
    }
    else
    {
        res.send(403);
    }
});



module.exports = router;
