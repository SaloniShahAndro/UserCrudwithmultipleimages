const User = require('../models/user.model')/* model class */
const bcrypt = require('bcrypt')/* for encrypting password */
const upload = require('../helpers/image-upload.helper').userMultiImageUpload;/* for using multer for uploading profilepic */
const Jimp = require("jimp");/* for resizing image */
const UserProfilepic = require('../models/profilepic.model')/* model class for pictures */
const fs = require('fs')/* fs for reading and writing file, here for unlinking profilepic from server */
const path = require('path');
const nodemailer = require('nodemailer');
const mailer = require('../helpers/mail.helper');


/**
 * First screen for login user
 * @api {get} /login Login
 * @apiName Login
 * @apiGroup User
 */
exports.getloginuser = (req, res) => {
  /* here req.user is for checking social login or not, if its is social login then it has value of req.user */
  if (req.user) {
    res.render('login', { user: req.user })
  } else {
    res.render('login', { user: null })
  }
}

/* screen for displaying dashboard */
exports.userdashboard = (req, res) => {
  /* here req.user is for checking social login or not, if its is social login then it has value of req.user */
  req.body.start = 0,
    req.body.limit = 5
  console.log(">>params in dashboard", req.body)
  /* social login */
  if (req.user) {
    User.findAll({ group: ['user_id'], include: [{ model: UserProfilepic }] }).then(alluserdata => {
      User.findAll({ include: [{ model: UserProfilepic }] }).then(alluserdataslider => {
        res.render('dashboard', { alluserdata: alluserdata, alluserdataslider: alluserdataslider, user: req.user })
      })
    })
  } else {
    /* general user login */
    if (usersession == false) {
      User.findAll({ group: ['user_id'], include: [{ model: UserProfilepic }] }).then(alluserdata => {
        User.findAll({ include: [{ model: UserProfilepic }] }).then(alluserdataslider => {
          res.render('dashboard', { alluserdata: alluserdata, alluserdataslider: alluserdataslider, user: null })
        })
      })
      usersession = true
    } else {
      User.findAll({ group: ['user_id'], include: [{ model: UserProfilepic }] }).then(alluserdata => {
        User.findAll({ include: [{ model: UserProfilepic }] }).then(alluserdataslider => {
          res.render('dashboard', { alluserdata: alluserdata, alluserdataslider: alluserdataslider, user: null })
        })
      })
    }
  }
}

/**
 *  This is post login function.In this function both social and general login is done
 * @api {Post} /dashboard/:page ApiLogin
 * @apiName ApiLogin
 * @apiGroup User
 * @apiparam {string} email      User's Email Id
 * @apiparam {string} password   User's Password(min 5 digit)
 */
exports.userdashboardPage = (req, res) => {
  var perPage = 5
  var page = req.params.page
  /* social login */
  if (req.user) {
    User.findAll({ include: [{ model: UserProfilepic }], offset: (perPage * page) - perPage, limit: perPage }).then(alluserdataslider => {
      User.count().then(count => {
        res.render('dashboard', { alluserdataslider: alluserdataslider, user: req.user, current: page, pages: Math.ceil(count / perPage) })
      })
    })
  } else {
    /* general user login */
    if (usersession == false) {
      User.find({ where: { email: req.body.email, usertype: 'admin' } }).then(userlogin => {
        if (userlogin) {
          bcrypt.compare(req.body.password, userlogin.password).then(function (loginwithpwd) {
            if (loginwithpwd == true) {
              usersession = true
              res.send({ response: true, message: 'User Login Successfully' })

            } else {
              res.send({ response: false, message: 'Please Enter Correct Password' })
            }
          })
        } else {
          res.send({ response: false, message: 'Please Enter Correct Email and Password' })
        }
      })
    } else {
      User.findAll({ include: [{ model: UserProfilepic }], offset: (perPage * page) - perPage, limit: perPage }).then(alluserdataslider => {
        User.count().then(count => {
          res.render('dashboard', { alluserdataslider: alluserdataslider, user: null, current: page, pages: Math.ceil(count / perPage) })
        })
      })
    }
  }
}

/**
 * displaying screen for add user
 * @api {get} /register Register
 * @apiName Register
 * @apiGroup User
 */
exports.registeruser = (req, res) => {
  if (usersession) {
    res.render('register')
  } else {
    res.redirect('/login')
  }
}


/**
 *  This is post Register function.For submitting user data
 * @api {Post} /api/register ApiRegister
 * @apiName ApiRegister
 * @apiGroup User
 * @apiparam {string} firstname           User's First name
 * @apiparam {string} lastname            User's Last name
 * @apiparam {string} email               User's Email Id
 * @apiparam {string} password            User's Password(min 5 digit)
 * @apiparam {string} description         User's Description
 * @apiparam {string} gender              User's gender (male or female)
 * @apiparam {string} status              User's status either active or inactive
 * @apiparam {string} profilepicture      User's profile picture(this can be multiple)
 * @apiparam {date}[date]                 User's date of birth
 * @apiparam {decimal}[latitude]          User's Location latitude
 * @apiparam {decimal}[longitude]         User's Location Longitude
 * @apiparam {string}[address]            User's address
 */
exports.postregisteruser = (req, res) => {
  upload(req, res).then(() => {
    var params = {}
    params = req.body
    User.find({ where: { email: req.body.email } }).then(userdata => {
      if (userdata) {

      } else {
        User.create(params).then(registerdata => {
          sendRegesterMail(registerdata)//for sending mail
          //for handling profile pics in db
          req.files.forEach(element => {
            UserProfilepic.create({
              profilepicture: element.filename,
              user_id: registerdata.id
            }).then((userprofilepicdata) => {
              resize_image(userprofilepicdata.profilepicture)/* for resizing image to display in dashboard */
            })
          })
        });
      }
    });
  })
}
/**
 * To check if the email id is already registered or not
 * @api {Post} /checkemailexist Check Email Exist
 * @apiName Check Email Exist
 * @apiGroup User
 * @apiparam {string} email      User's Email Id
 */
exports.checkemailexist = (req, res) => {
  upload(req, res).then(() => {
    User.find({ where: { email: req.body.email } }).then(userdata => {
      if (userdata) {
        console.log(">>>if checkemail")
        res.send(false)
       // res.send({status:req.body.email,message:'Email is already used',status:false})
      } else {
        console.log(">>>else checkemail")
        res.send(true)
       // res.send({status:null,message:'Email is new',status:true})
      }
    })
  })
}

/**
 * display user edit page of particular user
 * @api {get} /useredit/:id Edit User
 * @apiName Edit User
 * @apiGroup User
 */
exports.edituser = (req, res) => {
  if (usersession) {
    User.find({ where: { id: req.params.id }, include: [{ model: UserProfilepic }] }).then(edituserdata => {
      res.render('useredit', { userdata: edituserdata })
    })
  } else {
    res.redirect('/login')
  }
}

/**
 *  This is Edit User function.For submitting user's edited data
 * @api {Post} /api/useredit/:id ApiUserEdit
 * @apiName ApiUserEdit
 * @apiGroup User
 * @apiparam {string} firstname           User's First name
 * @apiparam {string} lastname            User's Last name
 * @apiparam {string} description         User's Description
 * @apiparam {string} gender              User's gender (male or female)
 * @apiparam {string} status              User's status either active or inactive
 * @apiparam {string} profilepicture      User's profile picture(this can be multiple)
 * @apiparam {date}[date]                 User's date of birth
 * @apiparam {decimal}[latitude]          User's Location latitude
 * @apiparam {decimal}[longitude]         User's Location Longitude
 * @apiparam {string}[address]            User's address
 */
exports.postedituser = (req, res) => {
  if (usersession) {
    upload(req, res).then(() => {
      var params = {}
      params['firstname'] = req.body.firstname;
      params['lastname'] = req.body.lastname;
      params['gender'] = req.body.gender;
      params['description'] = req.body.description;
      params['status'] = req.body.status;
      params['date'] = req.body.date;
      params['latitude'] = req.body.latitude;
      params['longitude'] = req.body.longitude;
      params['address'] = req.body.address;
      console.log(">>params", params)
      User.update(params, {
        where: {
          id: req.params.id
        }
      }).then(updatedata => {
        req.files.forEach(element => {
          UserProfilepic.create({
            profilepicture: element.filename,
            user_id: req.params.id
          }).then((userprofilepicdata) => {
            resize_image(element.filename)
          })
        })
      })
    })
  } else {
    res.redirect('/login')
  }
}

/**
 * Delete particular user
 * @api {get} /user/delete/:id Delete User
 * @apiName Delete User
 * @apiGroup User
 */
exports.deleteUser = (req, res) => {
  User.find({ where: { id: req.params.id }, include: [{ model: UserProfilepic }] }).then(userdata => {
    User.destroy({ where: { id: req.params.id } }).then(userdeletedata => {
      userdata.profilepics.forEach(element => {
        fs.unlink(`server/assets/tmp/${element.profilepicture}`)//for unlinking image from server
        fs.unlink(`server/assets/multiimage/${element.profilepicture}`)//for unlinking image from server
        res.send({data:userdata,message:'User deleted successfully',status:true})
      })
    })
  })
}

/*
* logout user */
exports.logoutuser = (req, res) => {
  usersession = false
  res.redirect('/login')
}

/**
 * remove image from database and also from server when click on remove image button in upload profile
 * @api {get} /removeimage/:id Remove Image
 * @apiName Remove Image
 * @apiGroup User
 */
exports.removeimage = (req, res) => {
  UserProfilepic.find({ where: { id: req.params.id } }).then(userdeleteddata => {
    UserProfilepic.destroy({ where: { id: req.params.id } }).then(userdata => {
      fs.unlink(`server/assets/tmp/${userdeleteddata.profilepicture}`)//for unlinking image from server
      fs.unlink(`server/assets/multiimage/${userdeleteddata.profilepicture}`)//for unlinking image from server
      res.send({data:userdeleteddata,message:'Image deleted successfully',status:true});
    }).catch(err => {
      res.error();
    })
  })
}

/* function for resizing image */
function resize_image(filename) {
  Jimp.read(`server/assets/multiimage/${filename}`, function (err, img) {
    if (err) console.log('ERROR==========>', err);
    img.resize(Jimp.AUTO, 100).quality(100).write(`server/assets/tmp/${filename}`); // save ;
  });
}

/* function for sending email when user register. */
function sendRegesterMail(data) {
  console.log(">>regestermail", data)
  var mail_data = {
    'template': 'register',
    'to': data.email,
    'subject': data.subject,
    'temp_data': data
  };
  mailer.sendMail(mail_data).then(rdata => {
    console.log("Mail Send==>", rdata)
    //res.send(res , data , "Please check your mail");
  }).catch(err => {
    console.log('Mail Failed : ', err);
    //res.error(res);
  });
}