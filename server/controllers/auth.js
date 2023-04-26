import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//REGISTER USER


// req,res are our request and response
// req the request body that we get from the frontend and response is the response provided to the frontend
export const register =async(req,res)=>{
    try {
        const{
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        }=req.body;

        const salt=await bcrypt.genSalt();
        const passwordHash=await bcrypt.hash(password,salt);

        //the way that the register function will work is that
        //we will save our user with the hashed password 
        // next time when user tries to login with the password we are going to salt that again
        // and we are gonna make sure that the password is indeed correct
        // and if it is such a case we will provide them with the json web token
        const newUser=new User({
            firstName,
            lastName,
            email,
            password:passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile:Math.floor(Math.random()*10000),
            impressions:Math.floor(Math.random()*10000),
        });
        const savedUser=newUser.save();
        // if the code works fine till here we will return the user a status code of 201
        // indicating something is create and the devloper on the frontend can 
        // verify with this response wether the created User is correct or not as from backend we do provide the response of the created User
        // json() creates a json version of our User model instance 
        res.status(201).json(savedUser);
    } catch (err) {
        //if there is some error in the request we will send an error message on the frontend with whatever the error our mongodb database has returned 
        res.status(500).json({error:err.message});
    }
}

/*LOGIN */
export const login= async (req,res)=>{
    try {
        const {email,password}=req.body;
        //use mongoose database and try to find the user with the provided email
        const user=await User.findOne({email:email});

        //now there are two scenarios either the user is present or the entered email is not associates to any register user
        //if the email is not present of any user yet we give a json response of status 400
        // that is  the server cannot or will not process the request due to something that is perceived to be a client error 
        if(!user) return res.status(400).json({msg:"User Does not exist"});
        //if the email is found in database correspoding to a particular use we go ahead and verify the password 
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg:"Invalid Credentials"});

        const token=jwt.sign({id:user.id},process.env.JWT_SECRET_KEY);
        delete user.password;
        res.status(200).json({token,user});


    } catch (error) {
        //if there is some error in the request we will send an error message on the frontend with whatever the error our mongodb database has returned 
        res.status(500).json({error:error.message});
    }
}



// jwt.sign() is a function provided by the jsonwebtoken library in Node.js for creating a JSON Web Token (JWT) with a given payload and secret key.
// A JWT is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of three parts: a header, a payload, and a signature.
// The jwt.sign() function takes in three parameters:
// 1.	The payload, which is an object containing the data that needs to be transmitted securely.
// 2.	A secret key, which is used to sign the token and verify its authenticity.
// 3.	An optional options object that can be used to specify the algorithm used for signing the token, the token's expiration date, and other settings.
// Once you call jwt.sign(), it returns a signed JWT that can be sent to the recipient. The recipient can then verify the JWT's authenticity by checking the signature using the same secret key. If the signature is valid, the recipient can use the data in the payload for further processing.

