
// Creating our User model
//Set it as export because we will need it required on the server
module.exports = function(sequelize, DataTypes) {
  var step = sequelize.define("application_step", {
    uid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true, //define a primaryKey
    },
    step: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  });

  return step;
};

