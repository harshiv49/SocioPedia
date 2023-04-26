import jwt from 'jsonwebtoken';


//authorization is basically restricting what users can do in an application once they are authenticated
//in node js its like a middleware that is basically a function or a piece of code 
export const verifyToken=async (req,res,next)=>{
    try {
        //the way we send the token is in http headers (Bearer (token)) so we here are trying to access the actual token 
        // by triming the left of the 'Bearer' string we can access our actual token fron which we can verify the token
        let token=req.header("Authorization");
        
        if(!token){
            return res.status(403).send("Access Denied");
        }
        if(token.startsWith("Bearer ")){
            token=token.slice(7,token.length).trimLeft();
        }
        const verified=jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user=verified
        next();
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

