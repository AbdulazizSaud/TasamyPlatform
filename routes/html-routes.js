// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
//
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
//
var db = require("../models");


var mainClientPage = "../public/members.html";
var engtestPage = "../public/survey.html";
var contactPage = "../public/test.html";
var OrgPage = "../public/test2.html";
var appstp1 = "../public/test3.html";
var appstp2 = "../public/test4.html";
var appstp3 = "../public/test5.html";
var conditionsAndPolicy = "../public/test6.html";

//
module.exports = function(app) {
//
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    res.sendFile(path.join(__dirname, "../public/index.html"));

  });


  app.get("/signup", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      if(req.user.roleID == 1)
      res.redirect("/members");
      else if(isAuthorized(req)) 
      res.redirect("/dashboard");
    }

    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
        if(req.user.roleID == 1)
      res.redirect("/members");
      else if(isAuthorized(req)) 
      res.redirect("/dashboard"); 
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });


  app.get("/auth/verfiyEmail/:token",function (req, res) {  

    var token = req.params.token;
    console.log("good" + token);
    res.send("mewo");
});



  app.get("/AboutSTCGrant", function(req, res) {
    // If the user already has an account send them to the members page
    res.sendFile(path.join(__dirname, "../public/introduction.html"));

  });


    // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be 
  //redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {

    if(!req.user)
    res.redirect("/login"); 


    if(req.user.roleID != 1)
    res.redirect("/login");
    else
    res.sendFile(path.join(__dirname,mainClientPage));
     
  });



  app.get( "/EligibilityTest",isAuthenticated,  async (req,res)=>{
    if (req.user) 
    {
      if(req.user.roleID != 1)
        res.redirect("/login");
      
      const result =  await getTestScore(req);
      
      if(result == null)
      res.sendFile(path.join(__dirname, engtestPage));
      else    
      res.redirect("/members"); 
    } 
    else
    res.redirect("/login"); 


  });



  
  app.get( "/OrganizationContact",isAuthenticated,  async (req,res)=>{
    if (req.user) {
      
      if(req.user.roleID != 1)
      res.redirect("/login");

      res.sendFile(path.join(__dirname, contactPage));
    } 
    else
    res.redirect("/login"); 

  });

  app.get( "/OrganizationInfromation",isAuthenticated,  async (req,res)=>{
    if (req.user) {
      
      if(req.user.roleID != 1)
      res.redirect("/login");

      res.sendFile(path.join(__dirname, OrgPage));
    } 
    else
    res.redirect("/login"); 

  });


  app.get( "/ApplicationStep1",isAuthenticated,  async (req,res)=>{
    if (req.user) {
      if(req.user.roleID != 1)
      res.redirect("/login");

      
      res.sendFile(path.join(__dirname, appstp1));
    } 
    else
    res.redirect("/login"); 

  });

  app.get( "/ApplicationStep2",isAuthenticated,  async (req,res)=>{
    if (req.user) {
      if(req.user.roleID != 1)
      res.redirect("/login");

      
      res.sendFile(path.join(__dirname, appstp2));
    } 
    else
    res.redirect("/login"); 

  });
  

  app.get( "/ApplicationStep3",isAuthenticated,  async (req,res)=>{
    if (req.user) {
      if(req.user.roleID != 1)
      res.redirect("/login");

      
      res.sendFile(path.join(__dirname, appstp3));
    } 
    else
    res.redirect("/login"); 

  });


  app.get( "/ConditionsAndPolicy",isAuthenticated,  async (req,res)=>{
    if (req.user) {
      if(req.user.roleID != 1)
      res.redirect("/login");

      res.sendFile(path.join(__dirname, conditionsAndPolicy));
    } 
    else
    res.redirect("/login"); 

  });
  
//


  app.get("/dashboard", function(req, res) {
    // If the user already has an account send them to the members page
    if (!req.user) {
      res.redirect("/login");
    } else if(isAuthorized(req))
    res.sendFile(path.join(__dirname, "../public/admin/index.html"));
    else 
    res.redirect("/login");
  
  });


  app.get("/dashboard/UserManagement", function(req, res) {
    // If the user already has an account send them to the members page
    if (!req.user) {
      res.redirect("/login");
    } else if(isAuthorized(req))
    res.sendFile(path.join(__dirname, "../public/admin/users.html"));
    else 
    res.redirect("/members");
  
  });
  



  app.get("/dashboard/NofiyIncompleted", function(req, res) {
    // If the user already has an account send them to the members page
    if (!req.user) {
      res.redirect("/login");
    } else if(isAuthorized(req))
    res.sendFile(path.join(__dirname, "../public/admin/NoficationInCompleted.html"));
    else 
    res.redirect("/members");
  
  });
  app.get("/dashboard/NofiyApproved", function(req, res) {
    // If the user already has an account send them to the members page
    if (!req.user) {
      res.redirect("/login");
    } else if(isAuthorized(req))
    res.sendFile(path.join(__dirname, "../public/admin/NoficationApproved.html"));
    else 
    res.redirect("/members");
  
  });

  app.get("/dashboard/NofiyRejected", function(req, res) {
    // If the user already has an account send them to the members page
    if (!req.user) {
      res.redirect("/login");
    } else if(isAuthorized(req))
    res.sendFile(path.join(__dirname, "../public/admin/NoficationReject.html"));
    else 
    res.redirect("/members");
  
  });

  app.get("/dashboard/NofiyEveryone", function(req, res) {
    // If the user already has an account send them to the members page
    if (!req.user) {
      res.redirect("/login");
    } else if(isAuthorized(req))
    res.sendFile(path.join(__dirname, "../public/admin/NoficationEveryone.html"));
    else 
    res.redirect("/members");
  
  });
  // end of api's


};







async function getTestScore(req) {
  return await db.eligibility_tests.findOne({
    where: { uid: req.user.id }
  }).catch(er => {
    console.log(er);
  });
}


function isAuthorized(req){

  return req.user.roleID == 4 || req.user.roleID == 3;

}
