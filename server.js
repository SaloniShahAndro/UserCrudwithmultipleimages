const express = require('express')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const app = express()
const session = require('express-session');
var Usermodel = require('./server/models/user.model')
var UserPicmodel = require('./server/models/profilepic.model')
var SUsermodel = require('./server/models/social.user.model')

// Passport session setup.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: "152992018711553",
  clientSecret: "d13bf7d08e6ddc7d5cffcdeed97cc4e1",
  callbackURL: "http://localhost:5515/auth/facebook/callback"

},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      SUsermodel.sync({ force: false }).then(() => {
        SUsermodel.findOne({ where: { 'userid': profile.id } }).then((users) =>{
          if(users){
            return done(null, users);
            console.log("User already exists in database");
           }else{
            console.log(">>accessToken", accessToken)
            console.log("There is no such user, adding now");
           // var names =  profile.name.givenName+" "+ profile.name.familyName 
            SUsermodel.create({ name: profile.displayName, userid: profile.id,accesstoken:accessToken }, function (err, user) {
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

passport.use(new TwitterStrategy({
  consumerKey     : "0k7WVzfzDEqRv1dizG0rBN2Tk",
  consumerSecret  : "iCE2zJLVqFUUrWUvgQ5YaHEGLEkvNUY5lb4jw9LtF6IgYAT98y",
  callbackURL     : "http://localhost:5515/auth/twitter/callback"

},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      SUsermodel.sync({ force: false }).then(() => {
        SUsermodel.findOne({ where: { 'userid': profile.id } }).then((users) =>{
          if(users){
            return done(null, users);
            console.log("User already exists in database");
           }else{
            console.log(">>accessToken", accessToken)
            console.log("There is no such user, adding now");
           // var names =  profile.name.givenName+" "+ profile.name.familyName 
            SUsermodel.create({ name: profile.displayName, userid: profile.id,accesstoken:accessToken }, function (err, user) {
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


app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/dashboard', failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/register');
  });

  app.get('/auth/twitter', passport.authenticate('twitter'));


app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/dashboard', failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/register');
  });

app.get('/logouts', function (req, res) {
  req.logout();
  res.redirect('/login');
});




global.baseurl = 'http://localhost:5515/'

app.listen(5515, () => console.log('Example app listening on port 5515!'))
