
// Creating our User model
//Set it as export because we will need it required on the server
module.exports = function(sequelize, DataTypes) {
    var approval = sequelize.define("application_approval", {
       req_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true, //define a primaryKey
          },
      admin1_UID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      note1: {
        type: DataTypes.TEXT,
      },
      approvment1: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      admin2_UID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      note2: {
        type: DataTypes.TEXT,
      },
      approvment2: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },{
      timestamps: false,   
      charset: 'utf8',
      collate: 'utf8_unicode_ci'
    });
  
    return approval;
  };
  
  