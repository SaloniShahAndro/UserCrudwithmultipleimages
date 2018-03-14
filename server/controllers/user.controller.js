
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const upload = require('../helpers/image-upload.helper').userMultiImageUpload;/* for using multer for uploading profilepic */
const Jimp = require("jimp");/* for resizing image */
const UserProfilepic = require('../models/profilepic.model')
const fs = require('fs')



/* First screen for login user */
exports.getloginuser = (req, res) => {
  if(req.user){
    res.render('login',{user:req.user})
  }else{
    res.render('login',{user:null})
  }
}

/* screen for displaying dashboard */
exports.userdashboard = (req, res) => {
  if(req.user){
    User.findAll({ group: ['user_id'], include: [{ model: UserProfilepic }] }).then(alluserdata => {
  
      User.findAll({ include: [{ model: UserProfilepic }] }).then(alluserdataslider => {

        res.render('dashboard', { alluserdata: alluserdata, alluserdataslider: alluserdataslider ,user:req.user})

      })

    })
  }else{
    if (usersession == false) {
      if (req.body.email == 'admin@gmail.com') {
        User.findAll({ group: ['user_id'], include: [{ model: UserProfilepic }] }).then(alluserdata => {
  
          User.findAll({ include: [{ model: UserProfilepic }] }).then(alluserdataslider => {
  
            res.render('dashboard', { alluserdata: alluserdata, alluserdataslider: alluserdataslider,user:null })
  
          })
  
        })
  
        usersession = true
      } else {
        res.redirect('back')
      }
    } else {
      User.findAll({ group: ['user_id'], include: [{ model: UserProfilepic }] }).then(alluserdata => {
        User.findAll({ include: [{ model: UserProfilepic }] }).then(alluserdataslider => {
          //console.log(">>>>>>>>>>>>all user data", alluserdata)
          res.render('dashboard', { alluserdata: alluserdata, alluserdataslider: alluserdataslider,user:null })
        })
      })
    }
  }
  

}

/* displaying screen for add user */
exports.registeruser = (req, res) => {
  if (usersession) {
    
      res.render('register')
    
    
  } else {
    res.redirect('/login')
  }

}


/* for submitting add user data  */
exports.postregisteruser = (req, res) => {

  upload(req, res).then(() => {
    var params = {}
    params = req.body
    console.log(">>params", params)
    User.sync({ force: false }).then(() => {

      User.find({ where: { email: req.body.email } }).then(userdata => {
        if (userdata) {
          // res.send('user already exists')
          res.redirect('back')

        } else {

          User.create(params).then(registerdata => {
            req.files.forEach(element => {
              //params['profilepicture'] = element.filename;

              // resize_image(element.filename)/* for resizing image to display in dashboard */


              UserProfilepic.sync({ force: false }).then(() => {
                UserProfilepic.create({
                  profilepicture: element.filename,
                  user_id: registerdata.id
                }).then((userprofilepicdata) => {

                  resize_image(userprofilepicdata.profilepicture)

                })
              });
            })
            res.redirect('/dashboard')

          });

        }
      })
    });
  })
}


/* display user edit data */
exports.edituser = (req, res) => {
  if (usersession) {
    User.find({ where: { id: req.params.id }, include: [{ model: UserProfilepic }] }).then(edituserdata => {
       console.log(">>>>edituserdata",edituserdata)
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
      console.log(">>params",params)

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
User.find({where:{id: req.params.id},include: [{ model: UserProfilepic }]}).then(userdata=>{
  User.destroy({ where: { id: req.params.id } }).then(userdeletedata => {
    userdata.profilepics.forEach(element=>{
      console.log(">>>element",element)
      fs.unlink(`server/assets/tmp/${element.profilepicture}`)//for unlinking image from server
      fs.unlink(`server/assets/multiimage/${element.profilepicture}`)//for unlinking image from server
    })
   
    res.redirect('/dashboard')
  })
})
  
 
}

/* logout user */
exports.logoutuser = (req, res) => {
  usersession = false
  res.redirect('/login')
}



/* remove image from database and also from server when click on remove image button in upload profile */
exports.removeimage = (req, res) => {
  UserProfilepic.find({ where: { id: req.params.id } }).then(userdeleteddata => {
    UserProfilepic.destroy({ where: { id: req.params.id } }).then(userdata => {
      fs.unlink(`server/assets/tmp/${userdeleteddata.profilepicture}`)//for unlinking image from server
      fs.unlink(`server/assets/multiimage/${userdeleteddata.profilepicture}`)//for unlinking image from server
      res.redirect('back')
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
