const passport = require('passport');
const userModel = require('../dao/usersDAO').ModelClass;
const config  = require('../config');
const JwtStrategy= require('passport-jwt').Strategy; 
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions,async (email,password,done)=>{
    let user = await userModel.findOne({email:email});
    console.log(user);

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
})

const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions,async (payload,done)=>{
   // console.log('authencticating')
    let user = await userModel.findOne({email:payload.sub});
    //console.log('*************************************',user);

        if(user){

            //console.log(user);
            done(null,user);
        }else{
            done(null,false);
        }
})

passport.use(jwtLogin);
passport.use(localLogin);

//module.exports = jwtLogin;