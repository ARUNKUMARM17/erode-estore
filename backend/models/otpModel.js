import mongoose from "mongoose";
const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        
    },
    otp:{
        type:String,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    expiresAt:{
        type:Date,
        default:()=>{
            return new Date(Date.now()+3*60*1000)
        }
    }
    
},{timestamps:true})

const OtpModel=mongoose.model('otp',otpSchema)
export default OtpModel;
