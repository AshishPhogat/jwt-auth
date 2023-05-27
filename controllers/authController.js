const User = require("../models/User");
const jwt = require('jsonwebtoken');

//handle error here
const handleError = (err)=>{
    // console.log(err.message,err.code);
    let error = {email: "",password : ""};

    //incorreect email 
    if(err.message === "incorrect email"){
        // console.log(err.message);
        error.email = 'that email is not registered';
    }
    //incorrect password
    if(err.message === "incorrect password"){
        // console.log(err.message);
        error.password = 'the password is incorrect';
    }

    //duplicate error
    if(err.code == 11000){
        error.email = 'This email is already registered';
        return error;
    }

    //validation errors
    if(err.message.includes("user validation failed")){
        Object.values(err.errors).forEach(({properties})=>{
            error[properties.path] = properties.message;
        });
    }
    return error;
}
const maxage = 3*24*60*60;
const createToken = (id)=>{
    return jwt.sign({id},'net ninja secret',{expiresIn: maxage });
}

const signup_get = (req,res)=>{
    res.render('signup');
}

const login_get = (req,res)=>{
    res.render('login');
}

const login_post = async (req,res)=>{
    const {email,password} = req.body;

    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie(`jwt`,token,{httpOnly: true,maxAge : maxage*1000});
        res.status(200).json({user: user._id});
    }catch(err){
        // console.log(err);
        const error = handleError(err);
        // console.log("error",error);
        res.status(400).json({error});
    }
}

const signup_post = async(req,res)=>{
    const newuser = new User({...req.body});
    try{    
        await newuser.save();
        const token = createToken(newuser._id);
        res.cookie(`jwt`,token,{httpOnly: true,maxAge : maxage*1000});
        res.status(200).json({user : newuser._id});
    }catch(err){
        const error = handleError(err);
        res.status(400).json({error});
    }
}

const logout_get = (req,res)=>{
    res.cookie('jwt','',{maxAge: 1});
    res.redirect('/');
}

module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get

};