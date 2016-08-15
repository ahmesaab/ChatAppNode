/**
 * Created by Ahmed on 4/18/2016.
 */

module.exports = {

    'facebookAuth' : {
        'clientID'      : '223618774679227',
        'clientSecret'  : '5c763d40eaef3c58f184cfb6d950a2aa',
        'callbackURL'   : 'http://test-smallworldbeta.rhcloud.com/auth/facebook/callback'
        //'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};