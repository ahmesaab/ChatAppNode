/**
 * Created by Ahmed on 4/17/2016.
 */
/**
 * Created by Ahmed on 3/8/2016.
 */
var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

router.get('/', function(req, res, next) {
    if(req.session.user)
    {
        var service = new Service();
        service.getMessages(req.query.mapId,req.query.count,
            function(messages)
            {
                res.send(messages);
            }
        )
    }
    else
    {
        res.sendStatus(403);
    }
});

module.exports = router;
