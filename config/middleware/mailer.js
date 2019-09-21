var nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
var smtpTransport = require('nodemailer-smtp-transport');
AWS.config.update({region: 'eu-west-1'});





const transport = nodemailer.createTransport(smtpTransport({
  host: 'email-smtp.eu-west-1.amazonaws.com',
  port: 465,
  secure: true,
  auth: {
    user: 'AKIASOD3FJCKG3O7MDLH',
    pass: 'BFQhEoxS0WISuPBYP/StjEw23aZaSSC5lpkjGOSbjSBV'
  }
}));


module.exports.sendEmail = async (from,to,subject,html) =>{
    await  transport.sendMail({from,to,subject,html},(err,info)=>{
            if(err) console.log(err) ;
            else console.log(info);
      });
}
