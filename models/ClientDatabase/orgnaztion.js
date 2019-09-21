var uuid = require('uuid/v4'); // ES5

// Creating our User model
//Set it as export because we will need it required on the server
module.exports = function(sequelize, DataTypes) {



  var Orgs = sequelize.define("organization", {
    org_ID: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1
    },
    UID: {
      type: DataTypes.UUID,
      allowNull: false
    },
    org_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    org_emp_num: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    work_field: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    num_volunteers: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    num_beneficiaries: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    contact_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contact_job_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contact_phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },{
    timestamps: false,   
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  Orgs.addHook("beforeCreate", function(org){
    org.org_ID = uuid();
  });



  return Orgs;
};

