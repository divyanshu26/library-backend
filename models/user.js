const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

//Define model

const userSchema = new Schema({
    email: {type:String, unique:true,lowercase:true,required:true},
    password: {
        type:String,
        required:true
    },
    issuedBooks: {
        type:Array,
        default:[]
    },
    totalBooksIssued:{
        type: Number,
        default:0
    },
    totalBooksReserved:{
        type:Number,
        default:0
    },
    reservedBooks:{
        type:Array,
        default:[]
    },
    dateJoined:{type:Date, default:new Date()},
    address:{
        type:Object,
        default:{
            city:'',
            street:'',
            country:'',
            zipcode:null
        }
    },
    phone:{type:String},
    fineAmount: {type:Number,default:0}

});

userSchema.pre('save',function(next){
    const user = this;
   
    bcrypt.genSalt(10,function(err,salt){
        
        if(err)return next(err);
        console.log(salt);
        bcrypt.hash(user.password,salt   , function(err, hash){
            if(err) return next(err);
            console.log('pre');
            user.password  =  hash;
            next();
        });
    });
});



//Create model class

userSchema.methods.comparePassword = function(candidatePassword, callback){
    //console.log(this,'passport################################',candidatePassword)
    bcrypt.compare(candidatePassword,this.password,(err,isMatch)=>{
        
        if(err)return callback(err);

        callback(null,isMatch); 
    })
}

const ModelClass = mongoose.model('user', userSchema);

//Export the model
console.log(userSchema); 
module.exports = ModelClass;