/*
The way we wanted to create the PostSchema
  _id                     the id of the model which uniquely identifies the Post entries
  userId                  the reference of the user who created the Post
  firstName               string entry 
  lastName                string entry
  description             string entry
  userPicturePath         url for the user image 
  picturePath             url for the picture of the post image
  likes                   we are gonna store likes a bit differently we are gonna have the refernce of the user object who liked the post 
                          basically reference of who liked it 
  comments                Array of Strings
  Note:striing entry is just some information we would like about the Post Schema usually such entries are created in the database
  to render specific information in the frontend
*/

import mongoose from "mongoose";

const PostSchema=mongoose.Schema(
    {
        userId:{
            type:String,
            required:true,
        },
        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String,
            required:true,
        },
        location:String,
        description:String,
        picturePath:String,
        userPicturePath:String,
        likes:{
            type:Map, 
            //check wether the userId exists in the Map value True if exists this search is O(1)
            //we could use an array instead of map but then we would have to loop through all the ids and check wether the particular id is false or true which would have been O(n) but using map search operation is O(1) 
            of:Boolean,
        },
        comments:{
            type:Array,
            default:[],
        },
    },
    {timestamps:true}
);

const Post=mongoose.model("Post",PostSchema);

export default Post;
