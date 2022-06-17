 //jshint esversion:6
 require('dotenv').config();
 const express = require("express");
 const bodyParser = require("body-parser");
 const request = require("request");
 const mongoose = require("mongoose");
 const https = require("https");
 const {MongoClient} = require('mongodb');
 const session = require('express-session');
 const passport = require("passport");
 const LocalStrategy = require('passport-local');
 const passportLocalMongoose = require("passport-local-mongoose");
 const axios = require('axios');
 var router= express.Router();


 let nam = "";
 let regno= "";
 let email = "";
 let contactn = "";
 let passout = "";
 let addres = "";
 let designationn = "";
 let workingin = "";

 const app = express();

 app.use(bodyParser.urlencoded({
   extended: true
 }));
 app.use(express.static("public"));
 app.set('view engine', 'ejs');

 app.use(session({
   secret: "our little secret.",
   resave: false,
   saveUninitialized: false
 }));

 app.use(passport.initialize());
 app.use(passport.session());

 mongoose.connect("mongodb+srv://user-sourabh:Paul1998@@cluster0.eplhw.mongodb.net/universityDB", {
   useNewUrlParser: true,
   useUnifiedTopology: true
 });
 mongoose.set('useCreateIndex', true);

 const uniSchema = new mongoose.Schema({
   name: String,
   regNo: String,
   username: String,
   contactNo: String,
   passoutY: String,
   address: String,
   password: String,
   designation: String,
   workingIn: String
 });
 const sinSchema = new mongoose.Schema({
   username: String,
   password: String
 });
 const inSchema = new mongoose.Schema({
  regNo: String,
});

 uniSchema.plugin(passportLocalMongoose);


 const List = mongoose.model("List", uniSchema);
 const List1 = mongoose.model("List1", sinSchema);
 const Abc = mongoose.model("Abc", inSchema);
 passport.use(List.createStrategy());
 passport.use(new LocalStrategy(List.authenticate()));
 passport.serializeUser(List.serializeUser());
 passport.deserializeUser(List.deserializeUser());


//home round
 app.get("/", function(req, res) {
   res.render("index");
 });

 //login round
 app.get("/login", function(req, res) {
   res.render("login");
 });
 //signup round
 app.get("/signup", function(req, res) {
   res.render("signup");
 });
 //admin page show
 app.get("/admin", function(req, res) {
   res.render("admin");
 });
 //registration page show
 app.get("/registration", function(req, res) {
  res.render("registration");
});

//dashboard module
 app.get("/dashboard", function(req, res) {
   if (req.isAuthenticated()) {
     res.render("dashboard", {
        idd: id,
        name: nam,
        regNo: regno,
        passoutY: passout,
        username: email,
        contactNo: contactn,
        Address: addres,
        designation: designationn,
        currentWorking: workingin,
      });
   } else {
     res.redirect("/login");
   }
 });

 //logout module
 app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
 });


 //signup data registration module
 app.post("/register", function(req, res) {
  List.register({name: req.body.Name,
  regNo: req.body.Regno,
  username: req.body.username,
  contactNo: req.body.Contact,
  passoutY: req.body.Passout,
  address: req.body.Address,
  designation: req.body.Designation,
  workingIn: req.body.Working_in}, req.body.password, function(err, user){
    if(err) {
     res.render("failed")
    } else {
      passport.authenticate("local")(req, res, function(){
        res.render("success");
      });
     }
   });
   });


   //*regno registration part
   app.post("/regno", function(req, res) {
    const user = new List1({
      regNo : req.body.regno,
    });
    Abc.findOne({ regNo : req.body.regno }, function(err, doc) {
      if(err){
        console.log(err);
      }else {
        List.find({}, function (err, allDetails) {
          if (err) {
              console.log(err);
          } else {
              res.render("success");
          }
       });
      };
    });
  });


  //admin login
  app.post("/adminreg", function(req, res) {
    const user = new List({
      username: req.body.username,
      password: req.body.password
    });
    req.login(user, function(err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function() {
          List1.findOne({ username: req.body.username }, function(err, doc) {
    if(err){
      console.log(err);
    }else {
      List.find({}, function (err, allDetails) {
        if (err) {
            console.log(err);
        } else {
            res.render("adminpanel", { details: allDetails })
        }
      })
    }
  })
})
      }
    })
  });


//update page parse data to html
  app.get("/update-user", function(req, res) {
      const id = req.query.id;
      List.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
          .then(data => {
              if(!data){
                  res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
              }else{
                res.render("update", {alldata: data})
              }
          })
          .catch(err =>{
              res.status(500).send({ message : "Error Update user information"})
          })
   }
  );

  //update user data module

  app.post("/updat", function(req, res) {
    const iid = req.body.id;
     const namee = req.body.Name;
     const regnn = req.body.Regno;
     const cnct = req.body.Contact;
     const pss = req.body.Passout;
     const adds = req.body.Address;
     const desi = req.body.Designation;
     const wrk = req.body.Working_in;
     List.findByIdAndUpdate(iid, { name: namee , regNo: regnn , contactNo: cnct , passoutY: pss , address: adds , designation: desi , workingIn: wrk},
                            function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        res.render("successup");
    }
});
  });


//login module

 app.post("/login", function(req, res) {
   const user = new List({
     username: req.body.username,
     password: req.body.password
   });
   req.login(user, function(err) {
     if (err) {
       console.log(err);
     } else {
       passport.authenticate("local")(req, res, function() {
         List.findOne({ username: req.body.username }, function(err, doc) {
   if(err){
     console.log(err);
   }else {
     nam=doc.name;
     regno= doc.regNo;
     email = doc.username;
     contactn = doc.contactNo;
     passout = doc.passoutY;
     addres = doc.address;
     designationn = doc.designation;
     workingin = doc.workingIn;
     id=doc.id;
   }
 });
      res.redirect("/dashboard");
       });
     }
   });
 });

//delete user module
  app.get("/delete-user", function(req, res, next) {
      const id = req.query.id;
  List.findByIdAndDelete(id)
      .then(data => {
          if(!data){
              res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
          }else{
              res.render("successdel");
          }
      })
      .catch(err =>{
          res.status(500).send({
              message: "Could not delete User with id=" + id
          });
      });
 });


//server
 let port = process.env.PORT;
 if(port == null || port == "") {
   port = 3000;
 }
 app.listen(port, function() {
   console.log("Server has started successully");
 });
