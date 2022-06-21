exports.signup = signup;
exports.signIn = signIn;
const userModel = require('../dao/usersDAO').ModelClass;
const jwt = require('jwt-simple');
const config = require('../config');



function getToken(user){
    const timestamp = new Date().getTime();
    return jwt.encode({sub:user.email, iat:timestamp},config.secret);
};

async function signup(req,res,next){
    //console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',req.body);
    try{
        const email = req.body.email;
    const password = req.body.password;
    

    if(!email || !password){
        res.status(422).send("Email and Password must be present");
        return;
    };
    const user = await userModel.findOne({email:email});
    //console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',user);
    if(!user){
        const new_user = new userModel({...req.body});
        const data = await new_user.save();
        //console.log(data);
        res.status(200).send({token : getToken(new_user)});
    }else{
        
        res.status(422).send({error:"Email is in use"});
    }
    }catch(err){
        console.log('authcontroller:36',err);
    };
};


async function signIn(req,res,next){
    console.log('sign in func');
    res.status(200).send({token:getToken(req.user)});
};