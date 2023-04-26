import User from "../models/User";

/* READ */
export const getUser = async (req,res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//slightly tricky 
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    //we make multiple api calls
    const friends = await Promise.all(
      //basically every friend is also a user so we go in our user model where we have stored the friends array and find the user by that id
      user.friends.map((id) => User.findById(id))
    );
    // format the 'friends' data we just got from the api calls to the database
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/*UPDATE*/
export const addRemoveFriend= async(req,res)=>{

    //basically in the url this time will be sending two ids which we destructure 
     try{
        const {id,friendId}=req.params;
        //user is the user currenlty logged in 
        const user=await User.findById(id);

        //friend of the user that we wish to add and remove
        const friend=await User.findById(friendId);

        if(user.friends.include(friendId)){
            //basically the filter function  gives us a new array of all the users with the id not equal to the friend Id
            //basically it removes the friendId from user.friends

            //a thing to note here is when a user removes somebody from their friendlist 
            // consequentially the user is removed from their friend's friendList as well  
            user.friends=user.friends.filter((id)=>id!==friendId)
            //we check if the current id the list of friends of friend of the user(the one we wish to remove)  is equal to that of user if so we remove
            //basicallly remove user from their friend's friendlist aswell
            friend.friends=friend.friends.filter((id)=>id !== id)
        }
        else{
          user.friends.push(friendId);
          friend.friends.push(id);
        }
    }
    catch(error){

    }
}