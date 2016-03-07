/**
 * Created by Ahmed on 3/6/2016.
 */
var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

router.get('/:chatID', function(req, res, next) {
    var currentUserID=req.session.userId;
    var chatID=req.param("chatID");
    if(currentUserID)
    {
        var service = new Service();
        service.getChatSession(currentUserID,chatID,
            function(chat,messages,members,status)
            {
                if(status)
                {
                    res.render('sockettest',
                        {
                            chat: chat,
                            messages: messages,
                            members: members,
                            userID: req.session.userId
                        })
                }
                else
                {
                    res.send(403);
                }
                service.close();
            });
    }
    else
    {
        res.send(403);
    }
});

module.exports = router;