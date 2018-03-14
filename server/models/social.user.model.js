const seq = require('../sequelize/sequelize.config.js')
const sUser = seq.sequelize.define('suser', {
    name: {
      type: seq.Sequelize.STRING
    },
   
    email:{
        type:seq.Sequelize.STRING,
    
    },
    userid:{
        type:seq.Sequelize.STRING
    },
    accesstoken:{
        type:seq.Sequelize.TEXT,
    }
  },
  );
  
  
 module.exports = sUser