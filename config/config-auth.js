/**
 * Created by Ahmed on 4/18/2016.
 */

module.exports = {

    'facebookAuth' : {
        'clientID'      : '455942167864223',
        'clientSecret'  : '136b8a1ff6fee455190a2f9d87298eb3',
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
        //'callbackURL'   : 'http://192.168.1.105:3000/auth/facebook/callback'
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