var path = require("path");

// Requiring our models and passport as we've configured it
var passport = require("../config/passport");
var userCore = require("../cores/userCore");
var engiTest = require("../cores/eligibility-testCore");
var orgnaztionCore = require("../cores/orgnaztionCore");
var applicationCore = require("../cores/applicationCore");
var app_step = require("../cores/applicationStepsCore");
var applicationApprovalCore = require('../cores/applicationApprovalCore');
var mailerCore = require('../cores/mailerCore');

var isAuthenticated = require("../config/middleware/isAuthenticated");


//
module.exports = async (app) => {



  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    

    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed


    if(req.user.roleID == 4 || req.user.roleID == 3){
      res.json({message:null,redirect:"/dashboard"});
      

    } else if(req.user.roleID == 1)
    res.json({message:null,redirect:"/AboutSTCGrant"}); 
    else{
      req.session.destroy();
      req.logout();
      res.json({message:"الرجاء تفعيل الحساب من البريد الأكتروني",redirect:"/dashboard"});
    }

  });
  //
  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error



  app.post("/api/signup",function (req, res) {

    userCore.createUser(req, res);

  });
  


  
  //
  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.session.destroy();
    req.logout();
    res.redirect("/login");
  });


  // Route for getting some data about our user to be used client side
  app.get("/api/user_data",isAuthenticated, async function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      //loadingSpinner.stop();
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea

      var data = {
          user:{email: req.user.email,
            firstname: req.user.firstname,
            lastname: req.user.lastname,
            id: req.user.id},
            request:{org:null,app:null},
            step:{stepdirection:null,stepinfo:null}
            };

            
         const p1 = await app_step.findStep(req);
         const p2 = await orgnaztionCore.getUserOrganization(req);
         const p3 = await applicationCore.findApplication(req);
         const p4 = await applicationApprovalCore.getUserApproval(req);


         data.step.stepinfo = req.session.app_step;

         if(data.step.stepinfo == null){
         res.json(data);
         return;

         }


         
         data.request.org = req.session.organization;
         data.request.app = p4;
         var step = parseInt(data.step.stepinfo.step);

         switch(step){

          case 0: data.step.stepdirection = {location:"/OrganizationContact",title:"معلومات التواصل"}; break; 
          case 1:data.step.stepdirection = {location:"/OrganizationContact",title:"تفاصيل التواصل"}; break; 
          case 2:data.step.stepdirection = {location:"/OrganizationInfromation",title:"تفاصيل المنظمة"};break; 
          case 3:data.step.stepdirection = {location:"/ApplicationStep1",title:"ملخص البرنامج"};break; 
          case 4:data.step.stepdirection = {location:"/ApplicationStep2",title:"تفاصيل البرنامج"};break; 
          case 5:data.step.stepdirection = {location:"/ApplicationStep3",title:"التفاصيل المالية"};break; 
          case 6:data.step.stepdirection = {location:"/ConditionsAndPolicy",title:"السياسات"};break; 

          default:
            data.step.stepdirection = null;break; 
    
        };


        
      res.json(data);
    }
  });





  // eligibility for get score

  app.get("/api/checkEligibilityTest",isAuthenticated, async (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else {
        engiTest.checkTest(req,res);
    }
  });


  
  app.get("/api/userOrganization",isAuthenticated, async (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else {

      orgnaztionCore.getUserOrganization(req,res);
    }
  });


  app.get("/api/userGetApproval",isAuthenticated, async (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else {
      applicationApprovalCore.getUserApproval(req,res);
    }
  });



  



  app.post("/api/signupEligibilityTest",isAuthenticated, function (req, res) {

    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else
    engiTest.submitTestScore(req,res);

  });


  app.post('/api/submitContactSetup',isAuthenticated, async (req, res) => {

    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else {


      if (req.session.org_ID == null) {
        var result = await orgnaztionCore.findOrganization(req);        
      }

      if (req.session.org_ID == null) {
        orgnaztionCore.create(req, res);
      }
      else {
        orgnaztionCore.updateContract(req, res);
      }
    }

  });


  app.post('/api/submitOrganizationSetup',isAuthenticated, async (req, res) => {

    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else {

      if (req.session.org_ID == null) {
        var result = await orgnaztionCore.findOrganization(req);        
      }

      if (req.session.org_ID == null) {
        res.redirect("/OrganizationContact");
      }
      else {
        // here we update
        orgnaztionCore.updateOrganization(req, res);
      }
    }

  });


  app.post('/api/submitApplicationSetup1',isAuthenticated, async (req, res) => {

    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else {


      if ( req.session.req_ID == null)
      var result = await applicationCore.findApplication(req);

      if (req.session.req_ID == null) {
        applicationCore.create(req,res);
      }
      else {
              // here we update
        applicationCore.updateApplication(req,res,1);
      }
    }

  });


  app.post('/api/submitApplicationSetup2',isAuthenticated, async (req, res) => {


    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else {


      if ( req.session.req_ID == null)
      var result = await applicationCore.findApplication(req);


      if (req.session.req_ID == null) {
        res.json("/ApplicationStep1");
      }
      else {

        // here we update
        applicationCore.updateApplication(req, res, 2);
      }
    }

  });

  app.post('/api/submitApplicationSetup3',isAuthenticated, async (req, res) => {


    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else {


      if ( req.session.req_ID == null)
      var result = await applicationCore.findApplication(req);


      if (req.session.req_ID == null) {
        res.json("/ApplicationStep1");
      }
      else {

        // here we update
        applicationCore.updateApplication(req, res, 3);
      }
    }

  });

  app.post('/api/submitApplicationSetupAgreeConditions',isAuthenticated, async (req, res) => {

    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else {

      res.json("/members");


    }

  });







  app.get('/api/admin/getAllApplicaionRequests',isAuthenticated, async (req, res) => {

    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else if(req.user.roleID == 4 || req.user.roleID == 3) {
      applicationCore.getAll(res,req);

    } else{
      res.json({});
      res.redirect("/");
    }

  });


  app.post('/api/admin/submitApproval',isAuthenticated, async (req, res) => {

    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else  if(req.user.roleID == 4 ) {
      applicationApprovalCore.update(req,res);
    } else {
      res.json({});
      res.redirect("/");
    }

  });






  app.get('/api/admin/getUsers',isAuthenticated, async (req, res) => {

    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else  if(req.user.roleID == 4) {
       userCore.getAllUsers(req,res);
    } else {
      res.json({});
      res.redirect("/");
    }

  });




  app.post('/api/admin/sendEveryone',isAuthenticated, async (req, res) => {

    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else  if(req.user.roleID == 4 ) {
      mailerCore.sendEveryone(req,res);
    } else {
      res.json({});
      res.redirect("/");
    }

  });


  app.post('/api/admin/sendApprove',isAuthenticated, async (req, res) => {

    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else  if(req.user.roleID == 4 ) {
      mailerCore.sendApproved(req,res);
    } else {
      res.json({});
      res.redirect("/");
    }

  });


  app.post('/api/admin/sendReject',isAuthenticated, async (req, res) => {

    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      res.redirect("/");
    } else  if(req.user.roleID == 4 ) {
      mailerCore.sendApproved(req,res);
    } else {
      res.json({});
      res.redirect("/");
    }

  });




  
  app.post("/api/uploadfile",isAuthenticated,async (req,res)=>{


    if (Object.keys(req.files).length == 0) {
      res.json("No File");
    }

  

    let sampleFile = req.files.fileUploaded;
    let typeofUpload = req.body.uploadType;
    let fileExtention = path.extname(sampleFile.name).toLowerCase();

    // -- vaildations
    var allowedFiles = [".doc", ".docx", ".pdf",".xlsx",".xlsm"];
    var doesMatch = false;
    allowedFiles.forEach(function(ext) {
      if(fileExtention === ext )
      doesMatch = true;
    });
    ///
    if(!doesMatch){
      return res.status(500).send('bad');

    }

     
    let fileName = req.user.id+'_'+typeofUpload+'_'+fileExtention;
    let filePath = path.join(__dirname,'../uploadedFiles/'+fileName);
    console.log("----------------> "+path.extname(sampleFile.name));



    sampleFile.mv(filePath, function(err) {
      if (err)    
        return res.status(500).send(err);
        res.json("uploaded File");
      });


  });






  
};






