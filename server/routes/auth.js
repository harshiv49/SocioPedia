import express from "express";
import {login} from '../controllers/auth.js';

const router=express.Router();


//routing organisation kinda like in django how we have base urls in project and extensions in app 
router.post('/login',login);
export default router;















//mongo db credentials
//harshiv49
//6nLuQW0MhVH5N8vw