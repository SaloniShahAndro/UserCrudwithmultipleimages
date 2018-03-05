const express = require('express')
var router = express.Router();
const controllers = require('../controllers/user.controller')

var Routes =[
    
    router.get('/register',controllers.registeruser),//3
    router.get('/login',controllers.getloginuser),//1
    router.post('/dashbord',controllers.postregisteruser),//4
    router.get('/dashboard',controllers.userdashboard),//2
    router.post('/dashboard',controllers.userdashboard),
    router.get('/user/delete/:id',controllers.deleteUser),
    router.get('/useredit/:id',controllers.edituser),//5
    router.post('/temp/:id',controllers.postedituser),
    router.get('/logout',controllers.logoutuser),
    router.get('/removeimage/:id',controllers.removeimage),
    
    
]

module.exports = Routes;