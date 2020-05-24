const Article = require('./models/articles');
const {check,validationResult} = require('express-validator');
const User = require("./models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.renderHomePage = (req,res)=>{
    //console.log(user);
    Article.find({},(err,articles)=>{
        res.render("index",{title:'Home',articles:articles});
    })    
}

exports.renderAddArticle =(req,res)=>{
    res.render("addArticle",{title:"Add Article"});
}

exports.addArticle = (req,res)=>{
    const {title,author,body} = req.body;

    let newArticle = new Article({
        title:title,
        author:author,
        body:body
    })

    newArticle.save((err)=>{
        if(err){
            console.log(err);
        }else{
            req.flash('success','Article Addedd Successfully');
            res.redirect("/");
        }
    })
}

exports.renderArticle = (req,res)=>{
    //console.log(req.params.id);
    Article.findById(req.params.id,(err,article)=>{
        if(err){
            console.log(err);
        }else{
        res.render("article",{title:article.title,article:article});
        }
    })
}

exports.renderEditPage = (req,res)=>{
    //console.log(req.params.id);
    Article.findById(req.params.id,(err,article)=>{
        if(err){
            console.log(err);
        }else{
        res.render("editArticle",{title:article.title,article:article});
        }
    })
}

exports.editArticle = (req,res)=>{
    Article.updateOne({_id:req.params.id},{$set: req.body},function(err){
        if(err){
            console.log(err);
        }else{
            req.flash('info','Article Updated Successfully');
            res.redirect("/");
        }
    })
}

exports.deleteArticle = (req,res)=>{
    Article.deleteOne({_id:req.params.id},(err)=>{
        if(err){
            console.log(err);
        }else{
            req.flash('danger','Article Deleted Successfully');
            res.redirect("/");
        }
    })
}

exports.renderRegister = (req,res)=>{
    res.render("register",{title:"Register",error:null});
}


exports.renderLogin = (req,res)=>{
    res.render("login",{title:"Login"});
}



exports.registerUser = (req,res)=>{
    console.log("validated");
   const {name,email,pass} = req.body;

   let errors = validationResult(req);
   console.log(errors.errors);
   if(!errors.isEmpty()){
    //req.flash('danger','Error');    
    res.render("register",{title:"Register",error:errors.errors,user:null});
   }else{
    User.findOne({'email':email},(err,user)=>{
        if(user){
            res.render("register",{title:"Register",user:null,error:[{msg:"Email already in use"}]});
        }else{
            bcrypt.hash(pass,10,function(err,hash){

                const user = new User({
                    name:name,
                    email: email,
                    password: hash
                }) ;
        
                user.save(err=>{
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        console.log("User Registered");
                        req.flash('success','You are now registered')
                        res.redirect("/user/login");
                    }
                    
                });
        
            })  
        }
    })  
     
   } 
}


exports.loginUser = (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:"/",
        failureRedirect:"/user/login",
        failureFlash:true
    })(req,res,next);
}

exports.logout = (req,res)=>{
    req.logout();
    req.flash("success","You are Logged Out");
    res.redirect('/user/login');
}

exports.ensureAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash('danger','Please login');
        res.redirect("/");
    }
}