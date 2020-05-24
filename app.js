require('dotenv').config();
const express = require('express');
const app = express();
let port = process.env.PORT;
const router = require("./router");
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const config = require("./config/database");
const passport = require("passport"); 
  

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine","ejs");

// Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//Session Middleware
app.use(session({
    secret:process.env.SECRET,
    resave:true,
    saveUninitialized:true,
    
}));

mongoose.connect("mongodb+srv://gaurav:gaurav123@cluster0-7xgrq.mongodb.net/articleDB",{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);

//Passport Config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get("*",(req,res,next)=>{
    res.locals.user = req.user || null;
    next();
})

//Requests
app.use("/",router);

//LISTEN
if(port == null || port == ""){
    port = 4000;
}
app.listen(4000,()=>{
    console.log("Server Started");
})
