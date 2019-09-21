
// Creating our User model
//Set it as export because we will need it required on the server
module.exports = function(sequelize, DataTypes) {



  var ROLES = sequelize.define("Roles", {
    role_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    role_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },{
    timestamps: false
  });

  return ROLES;
};

