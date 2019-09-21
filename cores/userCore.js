var db = require("../models");
var xss = require("xss");
var randomString = require('randomstring');
var mailer = require('../config/middleware/mailer');

module.exports.createUser = function (req, res){

  var _secretToken = randomString.generate();

  var email = xss(req.body.email);
  var firstname=xss(req.body.firstname);
  var lastname=xss(req.body.lastname);

 
    db.User.create({
        email:  email,
        password: xss(req.body.password),
        firstname:firstname ,
        lastname: lastname,
        PhoneNumber:xss(req.body.phone),
        secretToken:_secretToken,
        roleID:1
      }).then( function (data) {
          const html = `عزيزي ${firstname+''+lastname},
           هذا الرابط لتفعيل سحابك في STC Grant <br> ${_secretToken} <br> <a herf="http://localhost:8080/auth/verfiyEmail/${_secretToken}>http://localhost:8080/auth/verfiyEmail/${_secretToken}</a>"`;
      
      
           //await mailer.sendEmail("abdulaziz@tasamy.com",email,'تفعيل الإيميل',html);

        res.json("/login");

      }).catch(function (err) {
        console.log(err);
        res.status(422).json({responseJSON:err.errors[0].message});
      });
}

module.exports.findUser = function(_email,_password,done){
           // When a user tries to sign in this code runs
    db.User.findOne({
        where: {
          email: xss(_email)
        }
      }).then(function(dbUser) {
        // If there's no user with the given email
        if (!dbUser) {
          return done(null, false, {
            message: "Incorrect email."
          });
        }
        // If there is a user with the given email, but the password the user gives us is incorrect
        else if (!dbUser.validPassword(_password)) {
          return done(null, false, {
            message: "Incorrect password."
          });
        }
        // If none of the above, return the user
        return done(null, dbUser);
      });
}


module.exports.getAllUsers = async function(req,res){
  // When a user tries to sign in this code runs

  if(req.user.roleID != 4){
    res.json({});
  }

 var result = await db.User.findAll({
    where: {
      roleID: 1
    },attributes: ['id','firstname','lastname','roleID','PhoneNumber','email']
  });


  var data = [];

  result.forEach(element => {
    data.push(element.dataValues)
  });

  res.json(data);

}