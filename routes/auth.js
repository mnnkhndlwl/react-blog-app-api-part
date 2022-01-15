const router = require("express").Router();  // creating our express router to go to url where we want to go
const User = require("../models/User");   //we are using our user model here as we require user schema
const bcrypt = require("bcrypt");  // bcrypt is used to hide our passowrd

//REGISTER
//We're going to define what should be done when the route is hit, inside the callback function.
router.post("/register", async (req, res) => {   //we are using post method here because whenever we are required to create something we use post method
    // and when we are required to update something u should use put method and if you are fetching something you should use get method and 
    // to delete something we simply use our delete method i hope its all clear to you buddy
    // /register here refers to url where we want to go and we are using async because registering our user is gonna take some time and we 
    // dont know the duration and here in async req is what we are sending and res is what we are getting
  try {    // using try and catch error block here name se hi pta chal rha hai baki tum samajhdar to ho hi
    const salt = await bcrypt.genSalt(10);   //  to bcrypt our password
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({   // using our user schema 
      username: req.body.username,  //The req. body object allows you to access data in a string or JSON object from the client side.
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();    // to save our user
    res.status(200).json(user);           // setting our status to 200 and sending this user directly
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {  // agin using post method as we are sending user information
  try {
    const user = await User.findOne({ username: req.body.username });  //The findOne() method finds and returns one document that matches the given selection criteria.
    !user && res.status(400).json("Wrong credentials!");   // if there is no user in our db send wrong credentials message

    const validated = await bcrypt.compare(req.body.password, user.password);  //using compare method
    !validated && res.status(400).json("Wrong credentials!");

    const { password, ...others } = user._doc; // as we dont want to send our user password
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

// to test our requests i have used thunderclient