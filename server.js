const express = require('express')
const passport = require('passport') /* For authentication */
const FacebookStrategy = require('passport-facebook').Strategy/* For facebook integration */
const TwitterStrategy = require('passport-twitter').Strategy/* For twitter integration */
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;  

const app = express()
const session = require('express-session');
var Usermodel = require('./server/models/user.model')/* normal user model */
var UserPicmodel = require('./server/models/profilepic.model')/* model For multiple images */
var SUsermodel = require('./server/models/social.user.model')/*Social user model*/

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
            console.log(">>profile",  profile )
            return done(null, users);
            console.log("User already exists in database");
          } else {
            
            console.log(">>accessToken",  profile.name.givenName +" "+ profile.name.familyName )
            console.log("There is no such user, adding now");
             var names =  profile.name.givenName+" "+ profile.name.familyName 
            SUsermodel.create({ name: names, userid: profile.id, accesstoken: accessToken,email: (profile.emails[0].value || '').toLowerCase() }, function (err, user) {
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
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      SUsermodel.sync({ force: false }).then(() => {
        SUsermodel.findOne({ where: { 'userid': profile.id } }).then((users) => {
          if (users) {
            return done(null, users);
            console.log("User already exists in database");
          } else {
            console.log(">>accessToken", profile)
            console.log("There is no such user, adding now");
            // var names =  profile.name.givenName+" "+ profile.name.familyName 
            SUsermodel.create({ name: profile.displayName,userid:profile.id, accesstoken: accessToken }, function (err, user) {
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
  clientID: "1059024881435-g04nv2b2m6rcdlsk1tcgfvsbdunufabe.apps.googleusercontent.com",
  clientSecret: "a_sqehmHu--3WWvkmmPUd8PL",
  callbackURL: "http://localhost:5525/auth/google/callback",

},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      SUsermodel.sync({ force: false }).then(() => {
        SUsermodel.findOne({ where: { 'userid': profile.id } }).then((users) => {
          if (users) {
            console.log(">>profile",  profile )
            return done(null, users);
            console.log("User already exists in database");
          } else {
            
            console.log(">>accessToken",  profile.name.givenName +" "+ profile.name.familyName )
            console.log("There is no such user, adding now");
             var names =  profile.name.givenName+" "+ profile.name.familyName 
            SUsermodel.create({ name: names, userid: profile.id, accesstoken: accessToken,email: (profile.emails[0].value || '').toLowerCase() }, function (err, user) {
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
  res.send('Please login first')
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
      profilepicture: 'abc.jpg'
    });
  })

  UserPicmodel.sync({ force: false }).then(() => {
    UserPicmodel.create({
      profilepicture: null,
      user_id: 1
    })
  })
})

/* redirecting user after facebook login */
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

/* redirecting callback user after facebook login */
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/dashboard', failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/register');
  });
/* redirecting user after twitter login */
app.get('/auth/twitter', passport.authenticate('twitter'));

/* redirecting callback user after twitter login */
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/dashboard', failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/register');
  });

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', {  
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));
/* logout from social login */
app.get('/logouts', function (req, res) {
  req.logout();
  res.redirect('/login');
});

global.baseurl = 'http://localhost:5525/'

app.listen(5525, () => console.log('Example app listening on port 5525!'))
