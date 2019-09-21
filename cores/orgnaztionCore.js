var db = require("../models");
var app_step = require('../cores/applicationStepsCore');
var xss = require("xss");



function creatOrganization(req, res) {
    console.log("start_createOrgnaztion---------------->");
  
    db.organization.create({
      UID: xss(req.user.id),
      contact_name: xss(req.body.contact_name),
      contact_email: xss(req.body.contact_email),
      conact_job_name: xss(req.body.contact_job),
      contact_phone_number: xss(req.body.contact_phone_number)
    }).then(function () {

      app_step.update(req,res,2,"/OrganizationInfromation");

    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  
  }
  
  
  
  
  function updateOrganizationContact(req, res) {
    console.log("start_updateOrgnaztionContract---------------->");
  
    db.organization.update(
      {
        contact_name: xss(req.body.contact_name),
        contact_email: xss(req.body.contact_email),
        contact_job_name: xss(req.body.contact_job_name),
        contact_phone_number: xss(req.body.contact_phone_number)
      }, { where: { UID: xss(req.user.id) } })
      .then(function () {
        app_step.update(req,res,2,"/OrganizationInfromation");
      }).catch(function (err) {
        console.log(err);
        res.json(err);
      });
  
  }
  
  
  
  
  
  function updateOrganization(req, res) {
    console.log("start_updateOrgnaztion---------------->");
  
  
    db.organization.update(
      {
        org_name:xss(req.body.org_name),
        org_emp_num: xss(req.body.org_emp_num),
        work_field: xss(req.body.work_field),
        city: xss(req.body.city),
        num_volunteers: xss(req.body.num_volunteers),
        num_beneficiaries: xss(req.body.num_beneficiaries)
      }, { where: { UID: xss(req.user.id) } })
      .then(function () {

        app_step.update(req,res,3,"/ApplicationStep1");

      }).catch(function (err) {
        console.log(err);
        res.json(err);
      });
  
  }
  

  

module.exports.create = function(req,res){
    creatOrganization(req,res);
}


module.exports.updateContract = function(req,res){
    updateOrganizationContact(req,res);
}

module.exports.findOrganization = async function(req){



   var result = await db.organization.findOne({
    where: { UID: xss(req.user.id) }
  }).catch(er => {
    console.log(er);
  });

  if (result != null){
    req.session.org_ID = xss(result.org_ID);
  }

  return result;

}

module.exports.updateOrganization = updateOrganization;


module.exports.getOrganization = async function(id){
    


  var result = await db.organization.findOne({
   where: { org_ID: xss(id) }
 }).catch(er => {
   console.log(er);
 });



 return result;

}




module.exports.getUserOrganization = async function(req,res){
    

  if(req.session.organization !=null){
    res.json(req.session.organization);
    return;
  }

  var result = await db.organization.findOne({
   where: { UID: xss(req.user.id) }, attributes: ['org_name']
 }).catch(er => {
   console.log(er);
 });


 if(result.dataValues != null)
 req.session.organization = result.dataValues;

 res.json(req.session.organization);

}


module.exports.getUserOrganization = async function(req){
    

  if(req.session.organization !=null){
    return req.session.organization;
  }

  var result = await db.organization.findOne({
   where: { UID: xss(req.user.id) }, attributes: ['org_name']
 }).catch(er => {
   console.log(er);
 });


 if(result != null)
 req.session.organization = result.dataValues;

return result;
}
