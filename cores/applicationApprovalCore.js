    

    var db = require("../models");
    var app_step = require('../cores/applicationStepsCore');
    var xss = require("xss");

    

 module.exports.create= async (req,res,data)=>{

  var result = await db.User.findAll({
    where: { roleID: 4 },attributes: ['id']
  }).catch(er => {
    console.log(er);
  });



  var admin1_UID = result[0].id;
  var admin2_UID = result[1].id;

  var reqID = data.request_id;
  
  db.application_approval.create({
    req_id: reqID,
    admin1_UID: xss(admin1_UID),
    admin2_UID: xss(admin2_UID),
  }).then(function () {
    app_step.update(req,res,4,"/ApplicationStep2");
  }).catch(function (err) {
    console.log(err);
    res.json(err);
  });



 }    



 
module.exports.update = async function(req,res){




  var update_data;

  console.log(req.body.approvment1);

  update_data=  {
    note1:xss(req.body.note1),
    approvment1:xss(req.body.approvment1),
    note2:xss(req.body.note2),
    approvment2:xss(req.body.approvment2),
  };


  await db.application_approval.update( update_data, { where: { req_id: xss(req.body.req_id) } }).catch(function (err) {
      console.log(err);
      res.json(err);
    });

  res.json({message:'OK'});

}


 module.exports.get = async function(id){
  
  var result = await db.application_approval.findOne({where:{req_id:id}});

 return result;

}

    

module.exports.getUserApproval = async function(req,res){
  
  var result = await db.application_approval.findOne(
    {where:{req_id:req.user.id} , attributes: ['approvment1','approvment2']});

    console.log(result);

    res.json(result);

}


module.exports.getUserApproval = async function(req){
  
  if(req.session.req_ID == null)
  return null;


  var result = await db.application_approval.findOne(
    {where:{req_id:req.session.req_ID} , attributes: ['approvment1','approvment2']});


    return result.dataValues;

}

