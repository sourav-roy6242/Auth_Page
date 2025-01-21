import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
   verifyOtp: {
        type: String,
        default: '',
    },
    verifyOtpExpiryAt: {
        type: Number,
        default: 0 ,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    resetOtp: {
        type: String,
        default: '',
    },
   resetOtpExpireAt: {
        type: Number,
        default: 0,
    },
   
   
});

const UserModel = mongoose.models.user || mongoose.model("User", userschema);

export default UserModel;