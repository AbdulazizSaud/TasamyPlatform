    

    var db = require("../models");

    var xss = require("xss");

    

 module.exports.create= function(req,res){
      db.application_step.create({
        uid: xss(req.user.id),
        step:1,
      }).then(function (data) {
      
        req.session.app_step= {step:data.dataValues.step,createdAt:data.dataValues.createdAt}; 
        res.redirect("/members");
      }).catch(function (err) {
        console.log(err.code);
        res.redirect("/members");
      });

 }    



 
module.exports.update = function(req,res,step,next){
  
  db.application_step.update(
    {
      step: xss(step)
    }, { where: { uid: req.user.id } })
    .then(function () {
      req.session.app_step.step = xss(step);

      res.json(next);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });

    
}


 module.exports.findStep = async function(req){
    
  
  if(req.session.app_step !=null){
    return req.session.app_step;
  }

  var result = await db.application_step.findOne({
   where: { UID: xss(req.user.id) }, attributes: ['createdAt','step']
 }).catch(er => {
   console.log(er);
 });

 if (result != null){
   req.session.app_step = result.dataValues;
 }

 return result;

}

    