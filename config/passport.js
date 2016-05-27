
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./config-auth');
var Service = require('../data/service.js');

module.exports = function(passport)
{
    passport.serializeUser(function(userId, done)
    {
        done(null, userId);
    });

    passport.deserializeUser(function(userId, done)
    {
        var service = new Service();
        service.getUser(userId, function(user) {
            done(null, user);
        });
    });

    passport.use(
        new FacebookStrategy({
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL,
            profileFields   : ['id', 'emails', 'name']
        },
        function(token, refreshToken, profile, done)
        {
            process.nextTick(function()
            {
                var service = new Service();
                service.getUserByFacebookId(profile.id, function(user)
                {
                    if(user)
                    {
                        return done(null,user.id);
                    }
                    else
                    {
                        console.log(profile);
                        var newUser = {'facebookId':profile.id,'token':token,'firstName':profile.name.givenName,
                            'lastName':profile.name.familyName,'nickName':profile.name.givenName,'x':10,'y':10,'roomId':2,
                            'status':'offline','color':2,'shape':2};
                        service.addNewUser(newUser,function(userId)
                        {
                            return done(null, userId);
                        });
                    }
                });
            });
        }));
};

