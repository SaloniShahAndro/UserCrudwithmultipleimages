const seq = require('../sequelize/sequelize.config.js')
const bcrypt = require('bcrypt');
const User = seq.sequelize.define('user', {
    firstname: {
      type: seq.Sequelize.STRING
    },
    lastname: {
      type: seq.Sequelize.STRING
    },
    email:{
        type:seq.Sequelize.STRING,
        unique:true
    },password:{
        type:seq.Sequelize.STRING,
    },gender:{
        type:seq.Sequelize.ENUM,
        values:['male','female']
    },description:{
        type:seq.Sequelize.TEXT
    },profilepicture:{
        type:seq.Sequelize.STRING
    },status:{
        type:seq.Sequelize.ENUM,
        values:['active','inactive']
    }
  },
  {
    hooks : {
        beforeCreate : (user , options) => {
            {
                user.password = user.password && user.password != "" ? bcrypt.hashSync(user.password, 10) : "";
            }
        }
    },
    underscored: true,
    
});
  
  
 module.exports = User

 