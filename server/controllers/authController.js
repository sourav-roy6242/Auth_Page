import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

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
        //send confirmation  mail

        // const mailOptions = {
        //     from: process.env.SENDER_EMAIL,
        //     to: email,
        //     subject: "Welcome to our website",
        //     text: `Welcome to our Website. Your account has been created with email id: ${email}`
        // }
        // await transporter.sendMail(mailOptions);

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'scotty.casper51@ethereal.email',
                pass: 'TkK2mtTRDJv2t6FWpe'
            }
        });

        const mailOptions = {
            from: '<scotty.casper51@ethereal.email>' ,
            to: "roys45545@gmail.com",
            subject: "Welcome to our website",
            text: `Welcome to our Website. Your account has been created with email id: ${email}`
        }

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

    try{
        const {userId} = req.body;
        const user = await UserModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({ success: false, message: "User account is already verified" });
        }

        const otp = string(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpiryAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

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





export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: "Please fill all the fields" });
    }
    try {

        const user = await UserModel.findById(userId);

        if(!user){
            return res.json({ success: false, message: "User does not exist" });
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
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