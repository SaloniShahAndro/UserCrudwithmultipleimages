
const User = require('../models/user.model')/* model class */
const bcrypt = require('bcrypt')/* for encrypting password */
const upload = require('../helpers/image-upload.helper').userMultiImageUpload;/* for using multer for uploading profilepic */
const Jimp = require("jimp");/* for resizing image */
const UserProfilepic = require('../models/profilepic.model')/* model class for pictures */
const fs = require('fs')/* fs for reading and writing file, here for unlinking profilepic from server */
var phantom = require('phantom');
const path = require('path');
const nodemailer = require('nodemailer');


const mailer = require('../helpers/mail.helper');

// var pdf = require('html-pdf');
// var html = fs.readFileSync(path.resolve(__dirname, '../templates/dashboard.ejs'), 'utf8');
// var options = { format: 'Letter' };


/* First screen for login user */
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

/* pagination on dashboard */
exports.userdashboardPage = (req, res) => {
  var perPage = 5
  var page = req.params.page
  console.log(">>reqbody", req.body)

  /* social login */
  if (req.user) {
    User.findAll({ include: [{ model: UserProfilepic }], offset: (perPage * page) - perPage, limit: perPage }).then(alluserdataslider => {
      // User.findAll({ group: ['user_id'], include: [{ model: UserProfilepic }] }).then(alluserdata => {
      User.count().then(count => {
        res.render('dashboard', { alluserdataslider: alluserdataslider, user: req.user, current: page, pages: Math.ceil(count / perPage) })
      })
      //})
    })
  } else {
    console.log(">>>>usersession", usersession)
    /* general user login */
    if (usersession == false) {
      if (req.body.email == 'admin@gmail.com') {
        // User.findAll({ group: ['user_id'], include: [{ model: UserProfilepic }] }).then(alluserdata => {
        User.findAll({ include: [{ model: UserProfilepic }], offset: (perPage * page) - perPage, limit: perPage }).then(alluserdataslider => {
          User.count().then(count => {
            res.render('dashboard', { alluserdataslider: alluserdataslider, user: null, current: page, pages: Math.ceil(count / perPage) })
            usersession = true


          })
        })
        //})

      } else {
        res.redirect('/login')
      }

    } else {

      // User.findAll({ group: ['user_id'], include: [{ model: UserProfilepic }] }).then(alluserdata => {
      User.findAll({ include: [{ model: UserProfilepic }], offset: (perPage * page) - perPage, limit: perPage }).then(alluserdataslider => {
        User.count().then(count => {
          res.render('dashboard', { alluserdataslider: alluserdataslider, user: null, current: page, pages: Math.ceil(count / perPage) })
        })
      })
      //})

      if (!req.body) {
        res.redirect('/login')
      }

    }
  }
}

/* displaying screen for add user */
exports.registeruser = (req, res) => {
  if (usersession) {
    res.render('register', { someVal: '' })
  } else {
    res.redirect('/login')
  }
}

/* for submitting add user data  */
exports.postregisteruser = (req, res) => {
  upload(req, res).then(() => {
    var params = {}
    params = req.body
    User.sync({ force: false }).then(() => {
      User.find({ where: { email: req.body.email } }).then(userdata => {
        if (userdata) {

        } else {
          User.create(params).then(registerdata => {

            sendRegesterMail(registerdata)//for sending mail


            //for handling profile pics in db
            req.files.forEach(element => {
              //params['profilepicture'] = element.filename;
              // resize_image(element.filename)
              UserProfilepic.sync({ force: false }).then(() => {
                UserProfilepic.create({
                  profilepicture: element.filename,
                  user_id: registerdata.id
                }).then((userprofilepicdata) => {
                  resize_image(userprofilepicdata.profilepicture)/* for resizing image to display in dashboard */
                })
              });
            })
            //  res.redirect('/dashboard/1')
          });
        }
      })
    });
  })
}

exports.checkemailexist = (req, res) => {
  upload(req, res).then(() => {
    User.sync({ force: false }).then(() => {
      console.log(">>checkemail", req.body.email)
      User.find({ where: { email: req.body.email } }).then(userdata => {
        if (userdata) {
          console.log(">>>userdata",userdata)
          res.send(false)
        
        } else {
          res.send(true)
        
        }
      })
    })
  })
}
/* display user edit data */
exports.edituser = (req, res) => {

  if (usersession) {
    User.find({ where: { id: req.params.id }, include: [{ model: UserProfilepic }] }).then(edituserdata => {


      res.render('useredit', { userdata: edituserdata })

    })
  } else {
    res.redirect('/login')
  }

}

/* post user edit data */
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
          UserProfilepic.sync({ force: false }).then(() => {
            UserProfilepic.create({
              profilepicture: element.filename,
              user_id: req.params.id
            }).then((userprofilepicdata) => {
              resize_image(element.filename)

              // res.redirect('/dashboard')
            })
          });
        })
      })
    })
  } else {
    res.redirect('/login')
  }
}

/* delete user  */
exports.deleteUser = (req, res) => {
  User.find({ where: { id: req.params.id }, include: [{ model: UserProfilepic }] }).then(userdata => {
    User.destroy({ where: { id: req.params.id } }).then(userdeletedata => {
      userdata.profilepics.forEach(element => {
        fs.unlink(`server/assets/tmp/${element.profilepicture}`)//for unlinking image from server
        fs.unlink(`server/assets/multiimage/${element.profilepicture}`)//for unlinking image from server
        res.send()
      })
      
    })
  })
}

/* logout user */
exports.logoutuser = (req, res) => {
  usersession = false
  res.redirect('/login')
}

exports.generatepdf = (req, res) => {
  phantom.create().then(function (ph) {
    ph.createPage().then(function (page) {
      page.open("http://localhost:5525/dashboard/1").then(function (status) {

        // page.property('clipRect', { top: 50,  left: 10, width: 800, height: 600}).then(function() {
        // });
        page.property('viewportSize', { width: 800, height: 600 }).then(function () {
        });

        page.property('plainText').then(function (content) {
          // console.log(content);
          page.render('dashboardpage.pdf').then(function () {
            console.log('Page Rendered');
            let transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: 'zaptechzapian@gmail.com', // Your email id
                pass: 'zaptech123#' // Your password
              }
            });

            // setup email data with unicode symbols
            let mailOptions = {
              from: '"Saloni Shah" <admin@admin.com>', // sender address
              to: 'saloni@zaptechsolutions.com', // list of receivers
              subject: 'Pdf demo', // Subject line
              text: 'Find this attached pdf', // plain text body
              attachments: [{
                // path:'/home/saloni/Downloads/test.pdf',
                path: '/var/www/html/UserCrud/dashboardpage.pdf',
                // filename:'test.pdf',
                filename: 'dashboardpage.pdf',
                contentType: 'application/pdf'
              }], function(err, info) {
                if (err) {
                  console.log("err", err)
                } else {
                  console.log("info", info)
                }
              }
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              /* this is working but shows <a> tag values */

              console.log('Message sent: %s', info.messageId);
            });
            ph.exit();
          });
        });

      });
    });
  });


  /* html-pdf not working as it display just html tags n full code */
  // pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
  //   if (err) return console.log(err);
  //   console.log(res); // { filename: '/app/businesscard.pdf' }
  // });




  // page.paperSize = {
  //   format: 'A4',
  //   orientation: 'portrait',
  //   margin: {
  //     top: "1.5cm",
  //     bottom: "1cm"
  //   },
  //   footer: {
  //     height: "1cm",
  //     contents: phantom.callback(function (pageNum, numPages) {
  //       return '' +
  //         '<div style="margin: 0 1cm 0 1cm; font-size: 0.65em">' +
  //         '   <div style="color: #888; padding:20px 20px 0 10px; border-top: 1px solid #ccc;">' +
  //         '       <span>REPORT FOOTER</span> ' +
  //         '       <span style="float:right">' + pageNum + ' / ' + numPages + '</span>' +
  //         '   </div>' +
  //         '</div>';
  //     })
  //   }
  // };

  // // This will fix some things that I'll talk about in a second
  // page.settings.dpi = "96";

  // page.content = fs.read(system.args[1]);

  // var output = system.args[2];

  // window.setTimeout(function () {
  //   page.render(output, { format: 'pdf' });
  //   phantom.exit(0);
  // }, 2000);
}

/* remove image from database and also from server when click on remove image button in upload profile */
exports.removeimage = (req, res) => {
  UserProfilepic.find({ where: { id: req.params.id } }).then(userdeleteddata => {
    UserProfilepic.destroy({ where: { id: req.params.id } }).then(userdata => {
      fs.unlink(`server/assets/tmp/${userdeleteddata.profilepicture}`)//for unlinking image from server
      fs.unlink(`server/assets/multiimage/${userdeleteddata.profilepicture}`)//for unlinking image from server
      res.send(true);
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
    //cres.send(res , data , "Please check your mail");
  }).catch(err => {
    console.log('Mail Failed : ', err);
    //cres.error(res);
  });
}