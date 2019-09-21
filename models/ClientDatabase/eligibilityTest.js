
// Creating our User model
//Set it as export because we will need it required on the server
module.exports = function(sequelize, DataTypes) {
  var eligibility_tests = sequelize.define("eligibility_tests", {
    uid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true, //define a primaryKey
    },
    test_score: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
  },{
    timestamps: false
  });

  return eligibility_tests;
};

