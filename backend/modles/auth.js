const express=require('express');
const user=require('../modles/auth');
const bycrypt=require("bcryptjs");
const jsonweb=require("jsonwebtoken");
require('dotenv').config();
const serect_data="This is very confidential"
const fetchuser=require("../middleware/fetchuser");
const app=express();


//This is for creating a new user
app.post('/', async (req, res) => {
  try {
    let success=false;
    const { email, password, name,mobile } = req.body;

    const existingUser = await user.findOne({ email: email });
    if (existingUser) {
      return res.json({success:success})
    }

    const hashedPassword = await bycrypt.hash(password, 10);
    const newUser = new user({
      email: email,
      name: name,
      password: hashedPassword,
      mobile:mobile
    });

    await newUser.save();
    const id=newUser._id;
    // Create a JWT token with only the user ID as payload
    const token = jsonweb.sign({id:id}, serect_data);
    success=true;
    res.json({ authToken: token,success:success });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});


// This is for  login a user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const findUser = await user.findOne({ email: email });

    if (!findUser) {
      return res.status(404).send("User with this email does not exist in the database");
    }

    const isPasswordValid =  bycrypt.compare(password, findUser.password);

    if (!isPasswordValid) {
      return res.status(401).send("Incorrect password");
    }
    const id = findUser._id ; // Create a payload object with user ID
    const token = jsonweb.sign({id:id}, serect_data);

    res.json({ authToken: token, success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});



// for getting the details of user
app.post("/fetchuser", fetchuser, async (req, res) => {
  jsonweb.verify(req.token, serect_data, async (err, authData) => {
    if (err) {
      res.status(403).send("Invalid token");
    } else {
      try {
        const findUser = await user.findOne({ _id:authData.id });
        if (findUser) {
          res.json(findUser);
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        console.error('Error querying database:', error.message);
        res.status(500).send("Server error");
      }
    }
  });
});


module.exports=app;
