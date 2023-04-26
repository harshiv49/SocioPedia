import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import exp from "constants";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { register } from "./controllers/auth.js";
import { createPost } from './controllers/posts.js';
import { verifyToken } from "./middleware/auth.js";
import {users,posts} from "./data/index.js"
import User from "./models/User.js";
import Post from "./models/Post.js";
// CONFIGURATIONS
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename)
dotenv.config();
const app=express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors())
app.use("/assets",express.static(path.join(__dirname,'public/assets')))



// FILE STORAGE
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})

const upload=multer({storage});


/*ROUTES WITH FILES */

//These are routes where we send our post request

//We are going to run a middleware to upload picture 
//in our auth.js as we need the upload varibale 
app.post("/auth/register",upload.single("picture"),register);

// when we create the posts we need to allow the user to upload a picture 
// we give this a middleware verifyToken which will have to run before the createPost call this will check the authorization of the user
// we set a property picture if our "image" is located in picture property of our http call we would grab with this upload.single() function and upload it to our local folder 
app.post("/posts",verifyToken,upload.single("picture"),createPost)


//ROUTES 
app.use("/auth",authRoutes)
app.use("/users",userRoutes)
app.use("/posts",postRoutes)

/* MONGO DB */
const PORT=process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(PORT,()=>console.log(`Server Port: ${PORT}`));
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error)=>console.log(`${error} did not connect`))