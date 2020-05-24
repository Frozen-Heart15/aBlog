const localStrategy = require('passport-local').Strategy;
const User = require("../models/user");
const bcrypt = require('bcrypt');
const congif = require("../config/database");

module.exports = function(passport){
    //Local Strategy
    passport.use(new localStrategy(function(username,password,done){
        //Match Email
        User.findOne({email:username},function(err,user){
            if(err) throw err;
            if(!user){
                return done(null,false,{message:'No user found'})
            }

            //Match Password
        bcrypt.compare(password,user.password,function(err,match){
            if(err) throw err;
            if(match){
                return done(null,user);
            }else{
                return done(null,false,{message:'Wrong Password'});
            }
        })
        })

    }));
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
    
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        })
    })
}