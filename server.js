const express = require('express')
global.passport = require('passport') /* For authentication */
const FacebookStrategy = require('passport-facebook').Strategy/* For facebook integration */
const TwitterStrategy = require('passport-twitter').Strategy/* For twitter integration */
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const app = express()
const session = require('express-session');
var Usermodel = require('./server/models/user.model')/* normal user model */
var UserPicmodel = require('./server/models/profilepic.model')/* model For multiple images */
var SUsermodel = require('./server/models/social.user.model')/*Social user model*/
const fs = require('fs')/* fs for reading and writing file, here for unlinking profilepic from server */
const csv = require('csv')
var stream = fs.createReadStream("./server/csv.csv");
var cookieParser = require('cookie-parser')


// Passport session setup.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
/* Passport facebook stratergy */
passport.use(new FacebookStrategy({
  clientID: "152992018711553",
  clientSecret: "d13bf7d08e6ddc7d5cffcdeed97cc4e1",
  callbackURL: "http://localhost:5525/auth/facebook/callback",
  profileFields: ['id', 'email', 'first_name', 'last_name'],

},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      SUsermodel.sync({ force: false }).then(() => {
        SUsermodel.findOne({ where: { 'userid': profile.id } }).then((users) => {
          if (users) {
            console.log(">>profile", profile)
            return done(null, users);
            console.log("User already exists in database");
          }
           else {

            console.log(">>accessToken", profile.name.givenName + " " + profile.name.familyName)
            console.log("There is no such user, adding now");
            var names = profile.name.givenName + " " + profile.name.familyName
            SUsermodel.create({ name: names, userid: profile.id, accesstoken: accessToken, email: (profile.emails[0].value || '').toLowerCase() }, function (err, user) {
              if (err) { return done(err); }
              return done(null, user);
            });
          }
        });

        return done(null, profile);
      })
    })
  }
));
/* Passport twitter stratergy */
passport.use(new TwitterStrategy({
  consumerKey: "0k7WVzfzDEqRv1dizG0rBN2Tk",
  consumerSecret: "iCE2zJLVqFUUrWUvgQ5YaHEGLEkvNUY5lb4jw9LtF6IgYAT98y",
  callbackURL: "http://localhost:5525/auth/twitter/callback",
  includeEmail:true //for getiing email
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      SUsermodel.sync({ force: false }).then(() => {
        SUsermodel.findOne({ where: { 'userid': profile.id } }).then((users) => {
          if (users) {
            return done(null, users);
           
          } else {
            // var names =  profile.name.givenName+" "+ profile.name.familyName 
            /* for entering email in database */
            var emaill = null
            if(profile.emails){
               emaill = profile.emails[0].value 
            }else{
              emaill = null
            }
            SUsermodel.create({ name: profile.displayName, userid: profile.id, accesstoken: accessToken ,email:emaill }, function (err, user) {
              if (err) { return done(err); }
              return done(null, user);
            });
          }
        });

        return done(null, profile);
      })
    })
  }
));
/* google passport stratergy */
passport.use(new GoogleStrategy({
  clientID: "1059024881435-fnvi10doh52q2r690n9udonetoan5r1l.apps.googleusercontent.com",
  clientSecret: "BiMAy98TMaI-1FLnq6z3o3UE",
  callbackURL: "http://localhost:5525/auth/google/callback",

},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      SUsermodel.sync({ force: false }).then(() => {
        SUsermodel.findOne({ where: { 'userid': profile.id } }).then((users) => {
          if (users) {
            console.log(">>profile", profile)
            return done(null, users);
            console.log("User already exists in database");
          } else {
            console.log(">>accessToken", profile.name.givenName + " " + profile.name.familyName)
            console.log("There is no such user, adding now");
            var names = profile.name.givenName + " " + profile.name.familyName
            SUsermodel.create({ name: names, userid: profile.id, accesstoken: accessToken, email: (profile.emails[0].value || '').toLowerCase() }, function (err, user) {
              if (err) { return done(err); }
              return done(null, user);
            });
          }
        });

        return done(null, profile);
      })
    })
  }
));

/* body parsing middleware */
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
/* body parsing middleware end */

/* session */
app.use(session({
  cookie: { maxAge: 3600000, expires: false },
  secret: 'dom',
  resave: true,
  saveUninitialized: true
}));


global.usersession = false
/* For setting views */
app.use("/apidoc",express.static('apidoc'));
app.set('views', './server/templates/')
app.set('view engine', 'ejs')
app.use(passport.initialize());
app.use(passport.session());

/* For setting views end */

/* For routing */
const openroutes = require('./server/routes/open.routes')
app.use('/', openroutes)
/* For routing end */

/* For using assests to display images */
app.use('/assets', express.static('server/assets/'));


app.get('/', (req, res) =>
  //res.send('Please login first'),
  console.log('Cookies: ', req.cookies)
)

/* For adding data in database for the 1st time */
app.get('/add', (req, res) => {
  /* to create user admin */
  Usermodel.sync({ force: false }).then(() => {
    Usermodel.create({
      firstname: 'admin',
      lastname: 'sadmin',
      email: 'admin@gmail.com',
      password: '123456',
      gender: 'female',
      description: 'dsfsfsdfdsf',
      status: 'active',
      usertype: 'admin'
    });
  })

  UserPicmodel.sync({ force: false }).then(() => {
    UserPicmodel.create({
      profilepicture: null,
      user_id: 1
    })
  })

  var parser = csv.parse({
    delimiter: ',',
    columns: true
  })

  

    // var transform = csv.transform(function(row) {
    //   var resultObj = {
    //     firstname: row['firstname'],
    //     lastname: row['lastname'],
    //     email:row['email'],
    //     password:row['password'],
    //     gender:row['gender'],
    //     description:row['description'],
    //     status:row['status'],
    //     date:row['date'],
    //     latitude:row['latitude'],
    //     longitude:row['longitude'],
    //     address:row['address']
    //   }
    //   Usermodel.create(resultObj)
    //       .then(function() {
    //           console.log('>>>>>>>>>>>.Record created')
    //       })
    //       .catch(function(err) {
    //           console.log('Error encountered: ' + err)
    //       })
  //})
 // stream.pipe(parser).pipe(transform);

})

global.baseurl = 'http://localhost:5525/'

app.listen(5525, () => console.log('Example app listening on port 5525!'))
