import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from "bcryptjs"

export const sendEmail = async({email, emailType, userId}:any) => {
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if(emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId,
                {$set: {verifyToken : hashedToken, verifyTokenExpiry : Date.now() + 3600000 }}
            )
        }else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId,
                {$set: {forgotPasswordToken : hashedToken, forgotPasswordTokenExpiry : Date.now() + 3600000 }}
            )
        }


        const transport = nodemailer.createTransport({
            host: "sendbox.smtp.forwordmail.net",
            port: 2525,
            auth:{
                user: "c194f6f6788975",
                pass: "c5312f6f67889d",
            },
        });

        const mailOptions = {
            from: "one@one.com",
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"></a> to ${emailType === "VERIFY" ? "verify your emali " : "reset your password"} or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken} </p>`,
        }

        const mailResponse = await transport.sendEmail(mailOptions)
        return mailResponse

    } catch (error:any) {
        throw new Error(error.message)
    }
}