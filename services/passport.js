const passport = require('passport');
const User = require('../dao/usersDAO').ModelClass;
const config  = require('../config');
const JwtStrategy= require('passport-jwt').Strategy; 
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions,(email,password,done)=>{
    User.findOne({email:email},(err,user)=>{
        if(err)return done(err,false);

        if(user){
            //console.log('inside passport ',user);
            user.comparePassword(password,(err,isMatch)=>{
                if(err) return done(err);

                if(!isMatch) return done(null,false);

                done(null,user);
            })
        }else{
            done(null,false);
        }
    });
})

const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions,(payload,done)=>{
   // console.log('authencticating')
    User.findOne({email:payload.sub},(err,user)=>{ 
        if(err)return done(err,false);

        if(user){

            //console.log(user);
            done(null,user);
        }else{
            done(null,false);
        }
    });
})

passport.use(jwtLogin);
passport.use(localLogin);

//module.exports = jwtLogin;