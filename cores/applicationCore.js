var db = require("../models");
var app_step = require('../cores/applicationStepsCore');
var app_Approval = require('../cores/applicationApprovalCore');
var orgnaztionCore = require("../cores/orgnaztionCore");
var eg_test = require("../cores/eligibility-testCore");
var xss = require("xss");

// Requiring path to so we can use relative routes to our HTML files




async function createApplication(req, res) {

  var orgId;
  if (req.session.org_ID == null) {

    const result = await db.organization.findOne({
      where: { uid: xss(req.user.id) }, attributes: ['org_ID']
    }).catch(er => {
      console.log(er);
    });
    orgId = xss(result.org_ID);
    req.session.org_ID = xss(result.org_ID);

  }
  else
    orgId = xss(req.session.org_ID);

    

  db.application_requests.create({
    uid: xss(req.user.id),
    org_id: xss(orgId),
    Status: 0,
    application_name: xss(req.body.application_name),
    problem_to_slove: xss(req.body.problem_to_slove),
    description_seeking: xss(req.body.description_seeking),
    description_tech: xss(req.body.description_tech),
    num_beneficiaries: xss(req.body.num_beneficiaries)
  }).then(function (data) {
    // create approval
    app_Approval.create(req, res, data);

  }).catch(function (err) {
    console.log(err);
    res.json(err);
  });

}


function updateApplication(req, res, step) {

  if (step == 1) {




    db.application_requests.update(
      {
        application_name: xss(req.body.application_name),
        problem_to_slove: xss(req.body.problem_to_slove),
        description_seeking: xss(req.body.description_seeking),
        description_tech: xss(req.body.description_tech),
        num_beneficiaries: xss(req.body.num_beneficiaries)

      }, { where: { UID: xss(req.user.id) } })
      .then(function () {

        let next = "/ApplicationStep2";
        res.json(next);


      }).catch(function (err) {
        console.log(err);
        res.json(err);
      });

  } else if (step == 2) {

    db.application_requests.update(
      {
        start_date: xss(req.body.start_date),
        Implementation_schedule: xss(req.body.Implementation_schedule),
        excpeted_affect:xss(req.body.excpeted_affect),
        strategy_schedule: xss(req.body.strategy_schedule),
        type_started: xss(req.body.type_started),
        cooperation_orgs: xss(req.body.cooperation_orgs),
        presentation_program_file_path: xss(req.body.presentation_program_file_path)

      }, { where: { UID: req.user.id } })
      .then(function () {
        app_step.update(req, res, 5, "/ApplicationStep3");
      }).catch(function (err) {
        console.log(err);
        res.json(err);
      });
  } else if (step == 3) {


    db.application_requests.update(
      {
        expected_cost: xss(req.body.expected_cost),
        next_grant_strargy: xss(req.body.next_grant_strargy),
        costs_file_path: xss(req.body.costs_file_path),
        Status: 1
      }, { where: { UID: xss(req.user.id) } })
      .then(function () {
        app_step.update(req, res, 6, "/ConditionsAndPolicy");
      }).catch(function (err) {
        console.log(err);
        res.json(err);
      });
  }

}





module.exports.create = function (req, res) {
  createApplication(req, res);
}


module.exports.updateApplication = function (req, res, step) {
  updateApplication(req, res, step);
}

module.exports.findApplication = async function (req) {


  if ( req.session.req_ID != null){
      return req.session.req_ID;
  }


  var result = await db.application_requests.findOne({
    where: { UID: xss(req.user.id) } ,attributes: ['request_id']
  }).catch(er => {
    console.log(er);
  });

  if (result != null) {
    req.session.req_ID = xss(result.request_id);
  }

  return result;

}


module.exports.getAll = async function (res,req) {

  var ArrayofData = [];

  

 var result =  await db.application_requests.findAll();



 await Promise.all(result.map(async (element) => {

  var data = {
    request_id: "",
    req_data: null,
    approval: null,
    org_ID: "",
    org_data: null,
    eligibility_score:null
  };

  data.request_id = element.request_id;
  data.req_data = element.dataValues;
  data.org_ID = element.org_id;

  var org_elemnt= await orgnaztionCore.getOrganization(element.org_id);
  var aproval_elm= await app_Approval.get(element.request_id);
  var test = await eg_test.getWithID(element.uid);

  data.org_data = org_elemnt.dataValues;
  data.approval = aproval_elm.dataValues;
  if(test !=null)
  data.eligibility_score  = test.test_score;
  
  ArrayofData.push(data);

}));

  res.json(ArrayofData);
}

