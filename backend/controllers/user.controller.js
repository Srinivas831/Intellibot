const User = require("../models/User.model");
const Interview = require("../models/Interview.model");
const Feedback = require("../models/Feedback.model");
const bcrypt = require("bcrypt");

exports.getUserInterviews = async (req, res, next) => {
  const userId = req.userId;

  try {
    // Find the user's past interviews using the userId
    const user = await User.findById(userId).populate({
      path: "pastInterviews", // Populate the user's pastInterviews (array of Interview IDs)
      populate: {
        path: "feedback", // Populate the feedback for each interview
        model: "Feedback", // Model to use for populating feedback
      },
    });

    // Access the populated interviews with feedback
    const userInterviews = user.pastInterviews;
    // console.log(userInterviews);
    res.status(200).json({ userInterviews });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: "Could not retrieve user interviews" });
  }
};

exports.updateUser = async(req,res,next)=>{
  const { id } = req.params;
  const {username,password,bio}= req.body;
  console.log(id,"id")
  try{
    let user = await User.findOne({ _id: id });
    if(user)
    {
      bcrypt.hash(password, 8, async (err, hash)=> {
        // Store hash in your password DB.
        if (err) {
          return res.status(400).json({ message: "Couldn't hash password" });
        } else if (hash) {
          // Update user Data
          const updatedUser ={
            username,
            password: hash,
            bio,
          };
          console.log(updatedUser);
          await User.findByIdAndUpdate( id ,updatedUser);
          //send the updated User DEtails object as responsene 
          res.status(200).json({ message: "User Detailes Updated Successfully","User":req.body});
        }
      });
    }else{
      res.status(400).json({ message: "User Not Found" });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong while updating" });
  }
}
