const seq = require('../sequelize/sequelize.config.js')
const User = require('./user.model')

const UserProfilepic = seq.sequelize.define('profilepic', {
  profilepicture: {
      type: seq.Sequelize.STRING
    },
    user_id: {
      type: seq.Sequelize.INTEGER
    },
   
  },
  {
    underscored: true,
    
});
  
UserProfilepic.belongsTo(User,{foreignKey:"user_id",onDelete: 'cascade'});
User.hasMany(UserProfilepic,{foreignKey:"user_id" })
  
 module.exports = UserProfilepic