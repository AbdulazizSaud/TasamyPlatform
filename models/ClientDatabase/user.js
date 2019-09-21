// Requiring bcrypt for password hashing. Using the bcryptjs version as 
//the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
var uuid = require('uuid/v4'); // ES5

//
// Creating our User model
//Set it as export because we will need it required on the server
module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
     },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstname: {
        type: DataTypes.STRING,
      },
      lastname: {
        type: DataTypes.STRING,
      },
      roleID: {
        type: DataTypes.INTEGER,
        allowNull: false
      }, 
      secretToken: {
        type: DataTypes.STRING,
        allowNull: false,
      }

  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });


  // Creating a custom method for our User model. 
  //This will check if an unhashed password entered by the 
  //user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password

  User.addHook("beforeCreate", function(user){
    user.id = uuid();
  });


  User.beforeCreate(function(model, options, cb) {
    console.log("hi mewo");

  });

  User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return User;
};

