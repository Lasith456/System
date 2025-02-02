import {User} from "../models/user.model.js";
import {genarateVerificationCode} from "../utils/genarateVerificationCode.js";
import {genarateTokenAndSetCookie} from "../utils/genarateTokenAndSetCookie.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendVerificationEmail ,sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail} from "../mailtrap/emails.js";
export const signup = async (req,res)=>{
    const {email,password,name}=req.body;
    try {
        if(!email || !password ||!name){
             throw new Error("All Fields are required!"); 
        }
        const userAlreadyExist = await User.findOne({email});
        if(userAlreadyExist){
            return res.status(400).json({success:false,message:"user already exist"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const verificationToken=genarateVerificationCode();
        const user = new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt:Date.now()+24*60*60*1000
        });
        await user.save();

        genarateTokenAndSetCookie(res,user._id);
        await sendVerificationEmail(user.email,verificationToken,user.name);
        res.status(200).json({
            success:true,
            message:"User Created SuccessFully!",
            user:{
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        res.status(400).json({success:false,message:error.message});
    }
}
export const login = async (req,res)=>{
    const {email,password}= req.body;
    try {
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"Invalid Credentials"});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({success:false, message:"Invalid Credentials"});
        }
        genarateTokenAndSetCookie(res, user._id);
        user.lastLogin=new Date();
        await user.save();
        res.status(200).json({
            success:true,
            message:"Login Successfully",
            user:{
                ...user._doc,
                password:undefined,
                role: user.role,
            },
        })
    } catch (error) {
        console.error("Error with login",error);
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
export const logout = async (req,res)=>{
    res.clearCookie('token');
    res.status(200).json({success:true, message:"User Logout Successfully"})
}
export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
export const forgetPassword=async(req,res)=>{
    const {email}=req.body;
    try {
        const user =await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false, message:"User Not Found"});
        }
        const resetToken= crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt=Date.now()+1*60*60*1000; // 1hour
        user.resetPasswordToken=resetToken;
        user.resetPasswordExpiresAt=resetTokenExpiresAt;
        await user.save();
        if (process.env.NODE_ENV === "production") {
            await sendPasswordResetEmail(user.email,`${process.env.PROD_URL}/reset-password/${resetToken}`,user.name);

        }else{
            await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`,user.name);
        }
        res.status(200).json({success:true,message:"Password Reset link sent to your email"})
    } catch (error) {
        res.status(400).json({success:false, message:error.message});
    }
}
export const resetPassword=async(req,res)=>{
    try {
        const {token} =req.params;
        const {password} =req.body;
        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt:{$gt: Date.now()},
        });
        if(!user){
            return res.status(400).json({success:false, message:"Invalid or expired reset token"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        user.password=hashedPassword;
        user.resetPasswordToken=undefined;
        user.resetPasswordExpiresAt=undefined;
        await user.save();
        await sendResetSuccessEmail(user.email,user.name);
        res.status(200).json({success:true, message:"Password Reset Successfully"})
    } catch (error) {
        console.error("Error in reset passsword",error);
        res.status(400).json({success:false,message:error.message});
    }
}
export const checkAuth=async(req,res)=>{
    try {
        const user =await User.findById(req.userId).select("-password"); // if i use select it will sent response password is :undefined
        if(!user){
            return res.status(400).json({success:false, message:"User not found"});
        }
        res.status(200).json({success:true,user});
    } catch (error) {
        console.log("Error in Check Auth", error);
        res.status(400).json({success:false, message:error.message});
    }
}
