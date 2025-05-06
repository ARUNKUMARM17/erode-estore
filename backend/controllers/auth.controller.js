import express from 'express'
import otpService from '../services/otp.service.js'
import emailService from '../services/email.services.js'
import UserModel from '../models/userModel.js'

export const generateOtp=async(req,res)=>{
    try{
    const payload=req.body;
    const emailexists=await UserModel.findOne({email:payload.email})
    if(emailexists){
        return res.status(400).json({
            success:false,
            message:'Email already exists',
            
        });
    }
        const {otp,_id}=await otpService.generateOtp(payload.email);
        await emailService.sendOtp(payload.email,otp);
        console.log(otp);
        return res.status(200).json({
            success:true,
            message:'OTP sent successfully',
            data:{
                _id:_id,

            }
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const verifyOtp=async(req,res)=>{
    try{
        const payload=req.body;
        await otpService.verifyOtp(payload.id,payload.otp);
        return res.status(200).json({
            success:true,
            message:'OTP verified successfully',
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

