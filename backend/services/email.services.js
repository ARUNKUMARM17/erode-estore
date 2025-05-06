import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        this.mailOption={
            from: process.env.EMAIL_USER,
            to:'',
            subject:'OTP VALIDATION FOR ERODE MARKETTING EKART',
            html:''
        }
    }


    async sendOtp(email, otp){
        this.mailOption.to=email
        this.mailOption.html=`
        <h1>The Otp is <span style="color:blue;">${otp}</span></h1>
        `;
        await this.transporter.sendMail(this.mailOption)
    }
    

}
const emailService=new EmailService()
export default emailService;
