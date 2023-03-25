require("dotenv").config();
const mongoose = require("mongoose");
const { contentSchema } = require("./content.model");
const jwt = require("jsonwebtoken");
const secretKey = process.env.MY_LOGIN_SECRET_KEY;

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  lname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 8,
    maxlength: 14,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cpassword: {
    type: String,
    required: true,
    minlength: 6,
  },
  token: { type: String },
  todos: [contentSchema],
  shortstory: {
    story: {
      title: String,
      date: Date,
      sto: String,
    },
  },
});

// generating token
userSchema.methods.generateToken = async function () {
  try {
    const gen_token = jwt.sign({ _id: this._id }, secretKey);
    this.token = gen_token;
    await this.save();
    return gen_token;
  } catch (error) {
    console.log(error);
  }
};

const USER = new mongoose.model("USER", userSchema);

module.exports = USER;
