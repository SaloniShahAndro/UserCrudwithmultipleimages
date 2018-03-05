const express = require('express')
const app = express()
const session = require('express-session');
var Usermodel = require('./server/models/user.model')
var UserPicmodel = require('./server/models/profilepic.model')


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
      profilepicture:'abc.jpg'
    });
  })

  UserPicmodel.sync({force:false}).then(()=>{
    UserPicmodel.create({
      profilepicture:null,
      user_id:1
    })
  })


})
global.baseurl = 'http://localhost:5506/'

app.listen(5506, () => console.log('Example app listening on port 5506!'))
