/**
 * Created by Ahmed on 3/8/2016.
 */
var express = require('express');
var router = express.Router();
var Service = require('../data/service.js');

router.get('/', function(req, res, next) {
    if(req.session.passport)
    {
        var attribute = req.query.attribute;
        var value = req.query.value;
        var service = new Service();
        service.changeAttribute(attribute,value,String(req.session.passport.user),
            function(status)
            {
                if(status===true)
                {
                    res.sendStatus(200);
                }
                else
                {
                    res.sendStatus(500);
                }
            }
        )
    }
    else
    {
        res.sendStatus(403);
    }
});

module.exports = router;
