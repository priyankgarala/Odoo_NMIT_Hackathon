import User from '../models/User.js';

export const findUserByEmail = async(email) => {
    return await User.findOne({email});
}

export const findUserByEmailAndPassword = async(email) => {
    return await User.findOne({email}).select('+password');
}

export const findUserById = async(id) => {
    return await User.findById(id);
}

export const createUser = async(name,email,password) => {
    const newUser = new User({
        name,
        email,
        password
    });
     
    return await newUser.save();
}