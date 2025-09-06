import { findUserByEmail, findUserByEmailAndPassword, createUser } from "../microservices/user.dao.js";
import User from "../models/User.js";
import { signToken } from "../utils/helper.js";

export const registerUser = async(name,email,password) => {
    const user = await findUserByEmail(email);
    if(user) throw Error('User already exists');

    const newUser = await createUser(name,email,password);
    const token = signToken({id : newUser._id});
    return {token, user: newUser};
}

export const loginUser = async(email,password) => {
    console.log("Login attempt for email:", email);
    
    const user = await findUserByEmailAndPassword(email);

    if(!user){
        console.log('User not found with this email');
        throw new Error('Invalid credentials');
    }

    try{
        const isPasswordValid = await user.comparePassword(password);
        console.log("Password validation result: ", isPasswordValid);

        if(!isPasswordValid){
            throw new Error("Invalid Email or Password");
        }

        const token = signToken({id : user._id});
        console.log("Generated token:", token);
        console.log("User found:", user);
        
        return {token, user};
    }
    catch(error){
        console.error("Password comparison error", error);
        throw new Error("Invalid email or password");
    }
}