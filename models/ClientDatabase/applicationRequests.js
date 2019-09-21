var uuid = require('uuid/v4'); // ES5

// Creating our User model
//Set it as export because we will need it required on the server
module.exports = function(sequelize, DataTypes) {
  var Apps = sequelize.define("application_requests", {
    request_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true, //define a primaryKey
      defaultValue: DataTypes.UUIDV1
        },
    uid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    org_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    application_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    problem_to_slove: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description_seeking: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description_tech: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    num_beneficiaries: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Implementation_schedule: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    excpeted_affect: {
      type: DataTypes.TEXT,
      allowNull: true
    }
    ,
    strategy_schedule: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type_started: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cooperation_orgs: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    presentation_program_file_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expected_cost: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    next_grant_strargy: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    costs_file_path: {
      type: DataTypes.STRING,
      allowNull: true
    }

  },{
    timestamps: false,   
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });


  Apps.addHook("beforeCreate", function(app){
    app.request_id = uuid();
  });

  return Apps;
};

