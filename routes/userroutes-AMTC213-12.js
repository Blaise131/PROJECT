const { countDocuments } = require('../models/user');

module.exports = function (app) { // including mongoose configuration
    const mongoose = require('../config/dbconfig');

    // creating an instance of user base on model
    /**const User = require('../models/user');
    const payment = require('../models/user');
    const Observation = require('../models/user');*/

    const {User, payment, Observation} = require('../models/user');
    

    app.get("/users/adduser", (req,res) => {
        // render page with form to insert one user document
        res.render("../users/adduser");
    });

    app.get("/", (req,res) => {
        // render home page
        res.render("../index");
    });

    app.get("/users/login", (req,res) => {
        // render login page form
        res.render("../login");
    })

    app.get("/users/signup", (req,res) => {
        // render sign page form
        res.render("../signup");
    })
    
    app.get("/users/payment", (req,res) => {
        // render sign payment form page form
        res.render("../payment");
    })

    app.get("/users/observation", (req,res) => {
        // render observation form page
        res.render("../observation");
    })

    app.post("/users/observation", (req,res) => {
        //accept observation and create observation data in server
        Observation.create(req.body, function(err){
            if (err) throw err;
            res.redirect("/users/client");
        })
    })


    

    app.post("/users/signup", (req,res) => {
        //accept sign up form details and create document
        User.create(req.body, function(err){
            if (err) throw err;
            res.redirect("/users/login");
        })
    })

    /**app.get("/users/client", (req,res) => {
        // render client page
        res.render("../client");
    })*/

    app.post("/users/payment", (req,res) => {
        //accept payment details and create document
        payment.create(req.body, function(err){
            if (err) throw err;
            res.redirect("/users/client");
        })
    })

    

    app.get("/users/support", (req,res) => {
        // render client page
        res.render("../support");
    })


    app.get("/users/signout", (req,res) => {
        // render sign out and return to home page
        res.render("../index");
    })


    app.post("/users/adduser", (req,res) => {
        //accept details from form
        User.create(req.body, function (err) {
            if (err) throw err;
            res.redirect("/users/getusers");
        });
    });


    //--view all documents--
    app.get("/users/getusers", (req, res) => {
        //query all users' document
        User.findOne({}, function (err, ursQuery){
            if (err) throw err;
            // render page with all users' documents
            res.render("../users/getusers", { users: ursQuery });
        })
    })

    app.get("/users/getobservation", (req, res) => {
        //query all observation document
        Observation.find({}, function (err, ursQuery){
            if (err) throw err;
            // render page with all observation documents
            res.render("../users/getobservation", { users: ursQuery });
            console.log(ursQuery)
        })
    })

   

    app.get("/users/client", (req, res) => {
        //query all observation document
        Observation.find({}, function (err, ursQuery){
            if (err) throw err;
            // render page with all observation documents
            res.render("../client", { users: ursQuery });
            console.log(ursQuery)
        })
    })

    app.post("/users/observationquery", (req, res) => {
        //query all observation document
        Observation.findById(req.body._id, function (err, ursQuery){
            if (err) throw err;
            // render page with all observation documents
            res.render("../users/observationquery", { users: ursQuery });
            console.log(ursQuery)
        })
    })

    app.get("/users/queryuserbyid", (req,res) => {
        // query all user documents
        User.find({}, function (err, ursQuery){
            if (err) throw err;
            //render page with form to accept choice for one user
            res.render("../users/queryuserbyid", {users: ursQuery})

        })
    })

    app.post("/users/queryuser", (req,res) => {
        User.findById(req.body._id, function(err, ursQuery){
            if (err) throw err;
            res.render("../users/queryuser", { user: ursQuery})
        })
    })

}
