import { registerUser, loginUser } from "../services/authServices.js"
import { cookieOptions } from "../config/config.js";
import HttpError from "../utils/HttpError.js";

const register_user = async(req,res,next)=> {
    const {name, email, password} = req.body;
    try{
        const {token, user} = await registerUser(name,email,password);
        req.user = user;
        
        console.log("Registration - Setting cookie with token:", token);
        console.log("Registration - Cookie options:", cookieOptions);
        
        res.cookie("accessToken", token, cookieOptions);
        
        console.log("Registration - Cookie set successfully");
        res.status(200).json({message : "Registration Successful"});
    }
    catch(error){
        return next(HttpError.badRequest(error.message || "Registration failed"));
    }
}

const login_user = async(req,res,next)=> {
    const {email, password} = req.body;
    try{
        const {token, user} = await loginUser(email,password);
        req.user = user;
        
        console.log("Setting cookie with token:", token);
        console.log("Cookie options:", cookieOptions);
        
        res.cookie("accessToken", token, cookieOptions);
        
        console.log("Cookie set successfully");
        res.status(200).json({message : "Login Success"}); 
    }
    catch(error){
        return next(HttpError.unauthorized(error.message || "Invalid Credentials"));
    }
};

const logout_user = async(req,res)=> {
    res.clearCookie("accessToken", cookieOptions);
    res.status(200).json({message: "Logout Successful"});
};

export default {
    register_user,
    login_user,
    logout_user
}