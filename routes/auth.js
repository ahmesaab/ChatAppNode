/**
 * Created by Ahmed on 4/19/2016.
 */

module.exports = function(app, passport) {
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/game',
            failureRedirect : '/login'
        }));
}
