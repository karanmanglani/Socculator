const express=require('express');
const user=require('../modles/auth');
const bycrypt=require("bcryptjs");
const jsonweb=require("jsonwebtoken");
const { exec } = require('child_process');
const bodyParser = require('body-parser');
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

app.post('/submit', async (req, res) => {
  try {
    // const { playerName, playerTeam, opponentTeam, status } = req.body;
    //python main.py xgboost_model "Ludovic Magnin" Switzerland Argentina 1

    // Construct the command to run the Python script with the correct path
    const command = `python IIIT_NAYA_RAIPUR/python/main.py xgboost_model "Ludovic Magnin" Switzerland Argentina 1`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).send('Error executing script');
      }
      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
        return res.status(500).send('Error executing script');
      }
      // Send the output of the Python script as a response
      res.json({ success: true, result: stdout });
      console.log(stdout);
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).send('Server Error');
  }
});
module.exports=app;

