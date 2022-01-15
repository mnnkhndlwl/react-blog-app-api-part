// in this case we will be able to update or delete our users
const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Posts");
const bcrypt = require("bcrypt");

//UPDATE
router.put("/:id", async (req, res) => {  // we require user id so that we can find user and update it 
  if (req.body.userId === req.params.id) {  //The req.params property is an object containing properties mapped to the named route “parameters”. 
    //For example, if you have the route /student/:id, then the “id” property is available as req.params.id
    //userId is what we are sending and we are comparing it with req.params.id (we are taking req.params.id from our url)
    if (req.body.password) {  //if we are sending any password so we should hash our password
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(  // it will find our user by id and update it
        req.params.id,
        {
          $set: req.body, // using set method to set everything inside req.body
        },
        { new: true } // we were not able to see our updated user in our thunderclient request becuz of mongoose so we used new : true here
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("Nahi mila 🤣🤣😂🤣");
  }
});

//DELETE
 router.delete("/:id", async (req, res) => {
   if (req.body.userId === req.params.id) {
     try {                // first find user and then delete
       const user = await User.findById(req.params.id);
       try {
         await Post.deleteMany({ username: user.username }); // we are deleting user's post also and we can have many posts that's why we are using deleteMany
         await User.findByIdAndDelete(req.params.id);
         res.status(200).json("User has been deleted...");
       } catch (err) {
         res.status(500).json(err);
       }
     } catch (err) {
       res.status(404).json("User not found!");
     }
   } else {
     res.status(401).json("You can delete only your account!");
   }
 });

 //GET USER
 router.get("/:id", async (req, res) => {
   try {
     const user = await User.findById(req.params.id);
     const { password, ...others } = user._doc;
     res.status(200).json(others);
   } catch (err) {
     res.status(500).json(err);
   }
 });

module.exports = router;