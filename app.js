// Requiring necessary npm packages
const express = require("express");
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const session = require("express-session");
// Requiring passport as we've configured it
const passport = require("./config/passport");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");

const ora = require('ora');






const spinner = new ora({
	text: 'Loading unicorns',
	spinner: process.argv[2]
});

spinner.start();

setTimeout(() => {
	spinner.succeed();
}, 4000);

//
// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

//

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
//
// Syncing our database and logging a message to the user upon success

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    //console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});