/**
 * Created by Ahmed on 3/9/2016.
 */

var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

router.get('/', function(req, res, next) {
    if(req.session.user)
    {
        var service = new Service();
        service.addUserConversation(req.query.userId, req.query.chatId,
            function (status) {
                if (status === true) {
                    res.sendStatus(200);
                }
                else {
                    res.sendStatus(500);
                }
                service.close();
            }
        );
    }
    else
    {
        res.sendStatus(403);
    }
});

module.exports = router;
