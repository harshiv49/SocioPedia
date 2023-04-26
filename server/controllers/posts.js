import Post from '../models/Post.js';
import User from '../models/User.js';

/* CREATE */

export const createPost=async (req,res)=>{
    try {
        const {userId,description,picturePath}=req.body;
        const user=await User.findById(userId);
        const newPost=new Post({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            location:user.location,
            description,
            userPicturePath:user.picturePath,
            picturePath,
            likes:{
                // "someid":true this is the structure of representing wether someone has liked the post
            },
            comments:[]
        })  
        await newPost.save();

        //we grab all the posts data  and return to the front end

        const post=await Post.find();
        //201 represents succesfully creating something
        res.status(201).json(post);

    } catch (error) {
       res.status(409).json({message:error.message});
    }
}

/* READ */
//something that represents our news feed 
export const getFeedPosts=async (req,res)=>{
    try {
        const post=await Post.find();
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

export const getUserPosts=async (req,res)=>{
    try {
        const {userId}=req.params;
        //find the post with the userId
        const post = await Post.find({userId});
        res.status(200).json(post);

    } catch (error) {
        res.status(404).json({message:error.message});
    }
}

/* UPDATE */
export const likePost=async (req,res) =>{
    try {
        const {id}=req.params;
        const {userId}=req.body;
        //grab post information
        const post=await Post.findById(id);

        // Map.prototype.get() to find an element in a javscript map object
        //grab likes info that is wether the user has liked it or not 
        const isLiked=post.likes.get(userId);

        //liking the post is a toggle function if the userId exists and we click on the like button again it automatically should dislike the post
        if(isLiked){
            //if liked delete user (the consequent time the button is clicked) 
            // Map.prototype.delete() to delete from javascript map 
            post.likes.delete(userId);
        }
        else{
            //Map.prototype.set() method
            // the first time you click ur like button
            post.likes.set(userId,true);
        }   
        // save and return new Post 
        const updatedPost=await Post.findByIdAndUpdate(
            id,
            { likes : post.likes },
            { new:true } 
        );
        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(404).json({message:error.message});
    }
}