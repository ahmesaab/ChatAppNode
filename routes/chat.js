/**
 * Created by Ahmed on 3/6/2016.
 */
var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

router.get('/:chatID', function(req, res, next) {
    var chatId=req.param("chatID");
    if(req.session.user)
    {
        var service = new Service();
        service.getChatSession(req.session.user.id,chatId,
            function(chat,messages,members,status)
            {
                if(status)
                {
                    res.render('sockettest',
                        {
                            chat: chat,
                            messages: messages,
                            members: members,
                            user: req.session.user
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