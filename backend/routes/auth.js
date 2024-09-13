const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  mobile: {
    type: Number
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('IIT_Naya_Raiput_User', userSchema);
User.createIndexes();

module.exports = User;
