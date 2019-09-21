var mailer = require('../config/middleware/mailer');


module.exports.sendEveryone = async function (req, res) {


    // here we get all emails on database


    var addresses = ['test75@gmail.com','test4@gmail.com','test21@gmail.com'];


    var index, len;
    for (index = 0, len = addresses.length; index < len; index++) {
        var email = addresses[index];

        var html = '...'

        mailer.sendEmail('fromemail',email,'subject',html);

    }

}



module.exports.sendApproved = async function (req, res) {


    // here we get approved emails on database

    
    var addresses = ['test75@gmail.com','test4@gmail.com','test21@gmail.com'];


    var index, len;
    for (index = 0, len = addresses.length; index < len; index++) {
        var email = addresses[index];

        var html = '...'

        mailer.sendEmail('fromemail',email,'subject',html);

    }

}



module.exports.sendRejected = async function (req, res) {


    // here we get approved emails on database

    
    var addresses = ['test75@gmail.com','test4@gmail.com','test21@gmail.com'];


    var index, len;
    for (index = 0, len = addresses.length; index < len; index++) {
        var email = addresses[index];

        var html = '...'

        mailer.sendEmail('fromemail',email,'subject',html);

    }

}


module.exports.sendIncompleted = async function (req, res) {


    // here we get approved emails on database

    
    var addresses = ['test75@gmail.com','test4@gmail.com','test21@gmail.com'];


    var index, len;
    for (index = 0, len = addresses.length; index < len; index++) {
        var email = addresses[index];

        var html = '...'

        mailer.sendEmail('fromemail',email,'subject',html);

    }

}



module.exports.sendSpecfic = async function (req, res) {


    // here we get approved emails on database

    
    var addresses = ['test75@gmail.com','test4@gmail.com','test21@gmail.com'];


    var index, len;
    for (index = 0, len = addresses.length; index < len; index++) {
        var email = addresses[index];

        var html = '...'

        mailer.sendEmail('fromemail',email,'subject',html);

    }

}


