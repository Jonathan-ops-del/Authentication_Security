//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");        //* Using Google auth.

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//* Using Express-session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//* Using passport
app.use(passport.initialize());
app.use(passport.session());

//* Connection to the database


const login = "mongodb+srv://admin-john:";
const end = "@cluster0.jt8kr3a.mongodb.net/";
const database = "userDB";
const pw = process.env.MONGODB;
mongoose.connect(login + pw + end + database, {useNewUrlParser: true, useUnifiedTopology: true});

// creating schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

//* Using passportLocalMongoos

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
//* As if we use mongoose encryption method
// userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"] });

//* creating model
const User = new mongoose.model("User", userSchema);

//* passportLocalMongoose
passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

//* Using passport-google-oauth20 (Placed After all the setup or Before first route.)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      //callbackURL: "http://localhost:3000/auth/google/secrets",
      callbackURL: "https://my-secret-auth-app-e0e751b16de3.herokuapp.com/auth/google/secrets",
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);



//* Home route
app.get("/", (req, res) => {
  res.render("home");
});

//* Auth. Google Route
app.get("/auth/google/",passport.authenticate("google", { scope: ["profile"] }));

//* using google auth. to redirect user after authentication
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  }
);

//* Login route
app.get("/login", (req, res) => {
  res.render("login");
});

//* Submit Route
app.get("/submit",(req,res)=>{
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
})
//* signin route
app.get("/register", (req, res) => {
  res.render("register");
});

//* Secret route
app.get("/secrets", function (req, res){
  User.find({"secret": { $ne: null }})
  .then(function(foundUsers) {
    console.log(foundUsers);
    res.render("secrets", { usersWithSecrets: foundUsers });
  })
  .catch(function(err) {
    console.log(err);
  });

});
//* Logout route
app.get("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

//* Post register
app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    }
  );
});

//* Post login route
app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

//* Post route for Submit
app.post("/submit", async (req,res)=>{ //< Mark function with async keyword
  try{
     const submittedSecret = req.body.secret;
     console.log(req.user.id);
     const foundUser = await User.findById(req.user.id); //< Use await here
     if(foundUser){ //< User will be null if no match
        foundUser.secret = submittedSecret;
        await foundUser.save(); //< Use await here
        return res.redirect("/secrets");
     }else{
        //User not found so redirect or send appropriate message to front-end
     }
  }catch(err){
     console.log(err);
     //Handle error
  }
});


//! Server running at port 3000
let port = process.env.PORT;
if (port == null | port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("Server started on port 3000");
});