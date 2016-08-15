/**
 * Created by Ahmed on 3/6/2016.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    if(req.session.passport)
    {
        res.render('game-full',
            {
                title: 'Game of Life',
                userId: req.session.passport.user,
                socketUrl: getSocketUrl()
            })
    }
    else
    {
        res.redirect('/#login');
    }
});

function getSocketUrl()
{
    if(process.env.OPENSHIFT_NODEJS_IP)
    {
        return 'ws://'+process.env.OPENSHIFT_APP_DNS+':8000/game';
    }
    else
    {
        return 'http://localhost:3000/game';
        //return 'http://192.168.1.105:3000/game';
    }
}

module.exports = router;
