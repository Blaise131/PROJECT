const { countDocuments } = require("../models/user");

module.exports = function (app) {
  // including mongoose configuration
  const mongoose = require("../config/dbconfig");
  const session = require("express-session");

  // creating an instance of user base on model
  const User = require('../models/user');
  const payment = require('../models/payment');

  /**const Observation = require('../models/observation');*/

  const {Observation,Comment } = require("../models/observation");

  const bcrypt = require("bcrypt");
  const passport = require("passport");
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use(session({
    secret: "randomisedtext",
    resave: false,
    saveUninitialized: false,
  }))

  checkAuth = (req, res, next) => {
    // passport adds this to the request object
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login");
  };

  /**app.get("/users/adduser", (req, res) => {
    // render page with form to insert one user document
    res.render("../users/adduser");
  });*/

  app.get("/", (req, res) => {
    // render home page
    res.render("../index");
  });

  app.get("/users/login", (req, res) => {
    // render login page form
    console.log(`Authenticated at /login: ${req.isAuthenticated()}`);
    res.render("../login");
  });

  app.get("/users/signup", (req, res) => {
    // render sign page form
    res.render("../signup");
  });

  app.get("/users/payment", checkAuth, (req, res) => {
    // render sign payment form page form
    res.render("../payment");
  });

  app.get("/users/observation", checkAuth, (req, res) => {
    // render observation form page
    res.render("../observation");
  });

  app.post("/users/observation", checkAuth, (req, res) => {
    //accept observation and create observation data in server
    Observation.create(req.body, function (err, observation) {
      if (err) throw err;
      res.redirect("/users/client");
      console.log(observation);
    });
  });

  app.post("/comment", checkAuth,  (req,res) => {
    //accept comment and store comments data in database
    Comment.create(req.body, function(err, comment){
      if (err) throw err;
      //res.render("../users/observationquery", { comments: comment });
      console.log(comment);
    })
  })

  /**app.post("/users/signup", (req, res) => {
    //accept sign up form details and create document
    User.create(req.body, function (err, ursQuery) {
      if (err) throw err;
      res.redirect("/users/login");
    });
  });*/

  /**
   * Method to view logged in client users' profile
   */
  app.get("/users/clientprofile", checkAuth, (req,res)=>{
    User.findById({_id:req.user._id}, function(err, profile){
      if (err) throw err;
      res.render("../users/clientprofile", {users:profile})
    }
      );
  })

  /**
   * Method to view logged in support users' profile
   */
  app.get("/users/supportprofile", checkAuth, (req,res)=>{
    User.findById({_id:req.user._id}, function(err, profile){
      if (err) throw err;
      res.render("../users/supportprofile", {users:profile})
    }
      );
  })

  /**
   * Creating new user and storing them in the database with password hashed.
   */
  app.post("/users/signup", (req, res) => {
    // Creates and saves a new user with a salt and hashed password
    User.register(
      new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        address: req.body.address,
        userDOB: req.body.userDOB,
        gender: req.body.gender,
        category: req.body.category,
        roles: req.body.roles,
        terms: req.body.terms,
      }),
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          return res.render("../signup");
        } else {
          passport.authenticate("local")(req, res, function () {
            console.log(`Authenticated: ${req.isAuthenticated()}`);
            res.redirect("/users/login");
            console.log(user);
          });
        }
      }
    );
  });

 


  /**
   * HTTP method to authenticate login
   */
  app.post("/users/login",(req,res) =>{
    // finds one username
    User.findOne({username: req.body.username}, function (err, ursQuery){
      if(err){
        console.log(err);
        return res.render("../login");
      } else{
      // method to authenticate username and password
      passport.authenticate("local")(req,res, function(user){
        console.log(ursQuery);
        // conditions to be passed before relevant page is rendered.
        if(ursQuery.roles == "client" & ursQuery.accountStatus == "Active"){
          console.log(`Authenticated: ${req.isAuthenticated()}`);
          console.log("Successful login!!")
          res.redirect("/users/client")
          return;
        } 
        if(ursQuery.accountStatus == "suspended"){
          console.log(`Authenticated: ${req.isAuthenticated()}`);
          console.log("Account is suspended")
          res.redirect("/users/login")
          return;
        }
        else {
          console.log(`Authenticated: ${req.isAuthenticated()}`);
          res.redirect("/users/support")
          return;
        }
      })}
    })
  })

 /**app.post("/users/login", (req,res)=>{
    User.findOne({username:req.body.username}, function(err, user){
      console.log(user);
      if(user.roles == "client"){
        return passport.authenticate("local",{
          successRedirect: "/users/client",
          failureRedirect: "/users/login",
          
        })
      }
      if(req.body.roles == "support"){
        return passport.authenticate("local",{
          successRedirect: "/users/support",
          failureRedirect: "/users/login",
          
        })
      }
      else{
        console.log(err)
      }
    })
  })*/

  

  /**app.post("/users/login", (req, res) => {
    var user = User.findOne({
      username: req.body.username,
      password: req.body.password,
    });
  try{
    if (!user) {
      return response
        .status(400)
        .send({ message: "The username does not exist" });
    }
    if (!bcrypt.compareSync(request.body.password, user.password)) {
      return response.status(400).send({ message: "The password is invalid" });
      
    }
    return res.render("../client")
  } catch (error){
    console.log("error");
  }

  });*/

  /**app.get("/users/client", (req,res) => {
        // render client page
        res.render("../client");
    })*/

  app.post("/users/payment", checkAuth, (req, res) => {
    //accept payment details and create document
    payment.create(req.body, function (err, cardDetails) {
      if (err) throw err;
      console.log(cardDetails)
      res.redirect("/users/client");
    });
  });

  app.get("/users/support", checkAuth, (req, res) => {
    // render support page
    res.render("../support");
  });

  app.get("/users/signout", (req, res) => {
    // render sign out and return to home page
    res.render("../index");
  });

  app.post("/users/adduser", (req, res) => {
    //accept details from form
    User.create(req.body, function (err) {
      if (err) throw err;
      res.redirect("/users/getusers");
    });
  });

  //--view all client user documents--
  app.get("/users/getusers", checkAuth, (req, res) => {
    //query all client users' document
    User.find({}, function (err, ursQuery) {
      if (err) throw err;
      // render page with all users' documents
      res.render("../users/getusers", { users: ursQuery });
    });
  });

  app.get("/users/getobservation", checkAuth, (req, res) => {
    //query all observation document
    Observation.find({}, function (err, ursQuery) {
      if (err) throw err;
      // render page with all observation documents
      res.render("../users/getobservation", { users: ursQuery });
      console.log(ursQuery);
    });
  });

  app.get("/users/client",checkAuth, (req, res) => {
    //query all observation document
    Observation.find({}, function (err, ursQuery) {
      if (err) throw err;
      // render all observation on the client page
      res.render("../client", { users: ursQuery});

      //console.log(ursQuery);
    });
  });

  app.post("/users/observationquery", checkAuth, (req, res) => {
    //query one observation document at a time with _id
    Observation.findById(req.body._id, function (err, ursQuery) {
      if (err) throw err;
      // render page with all observation documents
      res.render("../users/observationquery", { users: ursQuery });
      console.log(ursQuery);
    });
    
  });

  app.get("/users/queryuserbyid", checkAuth, (req, res) => {
    // query all user documents
    User.find({}, function (err, ursQuery) {
      if (err) throw err;
      //render page with form to accept choice for one user
      res.render("../users/queryuserbyid", { users: ursQuery });
    });
  });

  app.post("/users/queryuser", checkAuth, (req, res) => {
    User.findById(req.body._id, function (err, ursQuery) {
      if (err) throw err;
      res.render("../users/queryuser", { users: ursQuery });
    });
  });

  //-------------------------update one client document------------------------
  app.get("/users/updateuser", checkAuth, (req, res) => {
    //query all users' documents
    User.find({}, function (err, findAllUsersQry) {
      if (err) throw err;
      //render page with form to accept choice for update
      res.render("../users/updateuser", { users: findAllUsersQry });
    });
  });

  // ------------------updating client details and rendering changes--------------
  app.post("/users/updateuser", checkAuth, (req, res) => {
    console.log(req.body);
    //update details with data sent through form
    User.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userDOB: req.body.userDOB,
          accountStatus: req.body.accountStatus,
          roles: req.body.roles
        },
      },
      null,
      function (err) {
        if (err) throw err;
        //show effect of update by redirecting to show all documents
        res.redirect("/users/getusers");
      }
    );
  });

  // -------------updating client user account details------------------
  app.get("/users/updateclientuser", checkAuth, (req, res) => {
    //query all users' documents
    User.findById({_id:req.user._id}, function (err, findAllUsersQry) {
      if (err) throw err;
      //render page with form for clients view profile.
      res.render("../users/updateclientuser", { users: findAllUsersQry });
    });
  });

  app.post("/users/updateclientuser", checkAuth, (req, res) => {
    console.log(req.body);
    //update details with data sent through form
    User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          address:req.body.address,
          userDOB: req.body.userDOB,
          gender: req.body.gender,
        },
      },
      null,
      function (err) {
        if (err) throw err;
        //show effect of update by redirecting to show all documents
        res.redirect("/users/clientprofile");
      }
    );
  });

/**
 * logging out users.
 */
  app.get("/logout", (req, res) => {
    console.log(`Authenticated at /logout: ${req.isAuthenticated()}`);
    req.logout();
    console.log("User has been logged out");
    console.log(`Authenticated at /logout: ${req.isAuthenticated()}`);
    res.redirect("/users/login");
    });

};
