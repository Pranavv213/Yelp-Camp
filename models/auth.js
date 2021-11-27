const mongoose=require('mongoose');
const passPortMongoose=require('passport-local-mongoose');
const UserSchema=new mongoose.Schema({
  
    email:{
        type:String,
        required:true,
        unique:true
    }
    // username:{
    //     type:String,
    //     required:true,
    //     unique:true
    // },
    // passord:{
    //     type:String,
    //     required:true,
    //     unique:true
    // }
    
})
UserSchema.plugin(passPortMongoose);
const Auth=mongoose.model('Auth',UserSchema);
module.exports=Auth;