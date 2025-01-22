import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";


import nodemailer from 'nodemailer';



export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Please fill all the fields" });
    }
    try {

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        //send welcome  mail

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });


        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to our website',
            text: `Welcome , ${name} to our website!  Your account has been created with email id: ${email}`,
        };


        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "User registered successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}



export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Please fill all the fields" });
    }

    try {

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ success: true, message: "User logged in successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}



export const logout = async (req, res) => {

    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",

        });

        return res.json({ success: true, message: "User logged out successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//verfication otp 
export const sendVerifyOtp = async (req, res) => {

    try {
        const { userId } = req.body;
        const user = await UserModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "User account is already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); //create 6 dig otp
        user.verifyOtp = otp; //save  this otp in database 
        user.verifyOtpExpiryAt = Date.now() + 24 * 60 * 60 * 1000; //set otp expire time
        await user.save(); //save user in database

        //create transporter

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification",
            text: `Your verification code is: ${otp}`
        }
        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Verification code sent successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}








//verify email using otp
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: "Please fill all the fields" });
    }
    try {

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid verification code" });
        }

        if (user.verifyOtpExpiryAt < Date.now()) {
            return res.json({ success: false, message: "Verification code has expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiryAt = 0;
        await user.save();

        return res.json({ success: true, message: "User account verified successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//check if user is authenticated
export const isAuthenticated = async (req, res) => {

    try {
        return res.json({ success: true, message: "User is authenticated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//send  password reset otp

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email){
        return res.json({success:false, message: 'Email is required'})
    }

    try {

        const user = await UserModel.findOne({email});
        if(!user){
            return res.json({success:false, message: 'User not found'});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); //create 6 dig otp
        user.resetOtp = otp; //save  this otp in database 
        user.resetOtpExpireAt = Date.now() + 15  * 60 * 1000; //set otp expire time
        await user.save(); //save user in database

        //create transporter

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is: ${otp}.
            Use this OTP to proceed with resetting your password.`
        };
        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "OTP send to your email" });
        
    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}

//reset user password

export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success:false, message: 'Please fill all the fields'});
    }

    try {

        const user = await UserModel.findOne({email});
        if(!user){
            return res.json({success:false, message: 'User not found'});
        }

        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success:false, message: 'Invalid OTP'});
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success:false, message: 'OTP has expired'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.json({success:true, message: 'Password has been reset successfully'});

        
    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}