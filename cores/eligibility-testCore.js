var db = require("../models");
var app_step = require('../cores/applicationStepsCore');
var xss = require("xss");

async function getScore(req){


    const result = await db.eligibility_tests.findOne({
      where: { uid: xss(req.user.id) },  attributes: ['test_score']
    }).catch(er => {
      console.log(er);
      res.json(err);
    });

    if(result !=null)
    req.session.entestresult = xss(result.test_score);

    return result;

  
}




async function getScoreWithId(id){


  const result = await db.eligibility_tests.findOne({
    where: { uid: xss(id) },  attributes: ['test_score']
  }).catch(er => {
    console.log(er);
    res.json(err);
  });

  return result;


}







async function updateScore(req,score)
{

 await db.eligibility_tests.update(
    {
      test_score: xss(score)
    }, { where: { uid: xss(req.user.id) } })
    .then(function () {
      res.json(next);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });


}



module.exports.submitTestScore = async function(req,res){



  if(req.session.entestresult !=null)
  {
    await updateScore(req,5);

    res.redirect("/members");
  } 


  var result = await getScore(req);

  if(result !=null){
    req.session.entestresult = xss(test_score);
  res.redirect("/members");
  }



  db.eligibility_tests.create({
    uid: xss(req.user.id),
    test_score: xss(req.body.test_score),
  }).then(function () {    
    req.session.entestresult = xss(req.body.test_score);

    // here we create application step
    app_step.create(req,res);

  
    
  }).catch(function (err) {
    console.log(err);
    res.json(err);
  });
}


module.exports.checkTest= async function (req,res){

    var testResult = req.session.entestresult;


    if (testResult == null ) {

      const result = await db.eligibility_tests.findOne({
        where: { uid: xss(req.user.id) }
      }).catch(er => {
        console.log(er);
      });

      if (result != null)
        req.session.entestresult = xss(result.test_score);
    }

    if (testResult == null) {
      res.json({ score: 'undefined'});
    }
    else {
      res.json({ score: xss(testResult) });

    }
}






module.exports.getFull = async function (req){


  const result = await db.eligibility_tests.findOne({
    where: { uid: xss(req.user.id) }
  }).catch(er => {
    console.log(er);
    res.json(err);
  });

  return result;


}



module.exports.get= getScore;

module.exports.getWithID= getScoreWithId;
