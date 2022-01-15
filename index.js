//So lets create our express server
const express = require("express");
const app = express();        // I am gonna create my application
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth") // to use our route
const userRoute = require("./routes/user")
const postRoute = require("./routes/posts")
const categoryRoute = require("./routes/categories")
const multer = require("multer") // multer is an library for images
const path = require("path");

dotenv.config(); //config will read your .env file, parse the contents to process.env

app.use(express.json()); // so that we can send our json object
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose.connect(process.env.MONGO_URL,{     //to connect to our mongodb
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("CONNECTED TO MONGODB")).catch((err)=>   //if connected it will show the message aotherwise catch will give error
    console.log(err));

    const storage = multer.diskStorage({  // creating storage 
      destination: (req, file, cb) => {   //indicating destination and this cb is call back function it's gonna take care of any error
        cb(null, "images");
      },
      filename: (req, file, cb) => {      
        cb(null, req.body.name);      // we have to send our file name
      },
    });
      

    //to upload our file
    const upload = multer({ storage: storage });     
    app.post("/api/upload", upload.single("file"), (req, res) => {
      res.status(200).json("File has been uploaded");
    });



app.use("/api/auth", authRoute); // using our auth route file
app.use("/api/user", userRoute); // using our user route file
app.use("/api/posts", postRoute); // using our post route file
app.use("/api/categories", categoryRoute); // using our categories route

app.listen("5000",() => {
  console.log("Hello manan");   // Simple way to print hello world in express
});