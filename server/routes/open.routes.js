const express = require('express')
var router = express.Router();
const controllers = require('../controllers/user.controller')

var Routes = [

    router.get('/register', controllers.registeruser),//3
    router.get('/login', controllers.getloginuser),//1
    router.post('/api/register', controllers.postregisteruser),//4
    router.post('/checkemailexist',controllers.checkemailexist),//for checking if email is already exist or not in add user.
    router.get('/dashboard/:page', controllers.userdashboardPage),//2
    router.post('/dashboard/:page', controllers.userdashboardPage),//2
    router.get('/user/delete/:id', controllers.deleteUser),
    router.get('/useredit/:id', controllers.edituser),//5
    router.post('/api/useredit/:id', controllers.postedituser),
    router.get('/logout', controllers.logoutuser),
    router.get('/removeimage/:id', controllers.removeimage),
    /* redirecting user after facebook login */
    router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' })),
    /* redirecting callback user after facebook login */
    router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/dashboard/1', failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/register');
        }),
    /* redirecting user after twitter login */
    router.get('/auth/twitter', passport.authenticate('twitter',{scope:['include_email=true']})),
    /* redirecting callback user after twitter login */
    router.get('/auth/twitter/callback',
        passport.authenticate('twitter', { successRedirect: '/dashboard/1', failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/register');
        }),
    /* redirecting user after google login */
    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] })),
    /* redirecting callback user after google login */
    router.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/dashboard/1',
        failureRedirect: '/login',
    })),
    /* logout from social login */
    router.get('/logouts', function (req, res) {
        req.logout();
        res.redirect('/login');
    }),

]

module.exports = Routes;