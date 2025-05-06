import OtpModel from "../models/otpModel.js";

class OtpService{
    async generateOtp(email){
        const otp=(Math.random()*1000000).toString().slice(0,4);
        console.log(otp);
        const otpObj=await OtpModel.create({
            email:email,
            otp:otp,
         
        })
        console.log(otpObj);
        return {
            otp:otp,
            _id:otpObj._id,
        };
    }
    async verifyOtp(id, otp){
        const otpObj=await OtpModel.findById(id)
        if(otpObj.isVerified){
            throw new Error('OTP already verified')
        }
        if(!otpObj){
            throw new Error('OTP not found')
        }
        if(otpObj.otp!==otp){
            throw new Error('Invalid OTP')
        }
        if(new Date()>otpObj.expiresAt){
            throw new Error('OTP expired')
        }
        otpObj.isVerified=true
        await otpObj.save()
        
    }
}
const otpService=new OtpService()
export default otpService;
