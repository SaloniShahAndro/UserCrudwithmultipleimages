const express = require('express')
var router = express.Router();
const controllers = require('../controllers/user.controller')

var Routes =[
    
    router.get('/register',controllers.registeruser),//3
    router.get('/login',controllers.getloginuser),//1
    router.post('/dashbord',controllers.postregisteruser),//4
    router.get('/dashboard',controllers.userdashboard),//2
    router.get('/dashboard/:page',controllers.userdashboardPage),//2
    router.post('/dashboard/:page',controllers.userdashboardPage),
    router.get('/user/delete/:id',controllers.deleteUser),
    router.get('/useredit/:id',controllers.edituser),//5
    router.post('/temp/:id',controllers.postedituser),
    router.get('/logout',controllers.logoutuser),
    router.get('/removeimage/:id',controllers.removeimage),
   
   
    
]
function ensureAuthenticated(req, res, next) {
    
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/dashboard')
   
  }
module.exports = Routes;