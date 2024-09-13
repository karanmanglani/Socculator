const connect= require('./db');
const express = require('express')
const cors=require('cors');
require('dotenv').config();
const port=process.env.PORT;
connect();
const app = express()
app.use(express.json());
app.use(cors());

app.listen(port, () => {
})