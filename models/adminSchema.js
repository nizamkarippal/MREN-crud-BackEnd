const mongoose = require("mongoose");


const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique:true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
});


module.exports =  mongoose.model("Admins", adminSchema);