const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {                     //to create user schema we require username 
      type: String,                 //of type string
      required: true,               //it is definitely required
      unique: true,                 //and it should be unique
    }, 
    email: {                        //same we required our email
      type: String,
      required: true,
      unique: true,
    },
    password: {                     //password and profile pic
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }  //Mongoose schemas have a timestamps option that tells Mongoose to automatically manage createdAt and updatedAt properties on your documents
);

module.exports = mongoose.model("User", UserSchema);


