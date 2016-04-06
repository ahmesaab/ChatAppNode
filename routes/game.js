/**
 * Created by Ahmed on 3/6/2016.
 */
var express = require('express');
var router = express.Router();
var os = require('os');

router.get('/', function(req, res, next) {
    if(req.session.user)
    {
        res.render('theme/game',
            {
                user: req.session.user,
                title: 'Game of Life',
                socketUrl:"http://"+getServerIps()[0]+":2000/game"
            })
    }
    else
    {
        res.redirect('/login');
    }
});

function getServerIps()
{
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    return addresses;
}

module.exports = router;