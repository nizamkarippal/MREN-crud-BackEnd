const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const managerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
  },
  mobile: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    default: "Manager@1245",
    required: [true, "password is required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// encrypting the password before saving
// managerSchema.pre("save", async function (next) {
//   try {
//     const hashedPassword = await bcrypt.hash(this.password, 10);
//     this.password = hashedPassword;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const ManagerCLTN = new mongoose.model("Manager", managerSchema);

module.exports = ManagerCLTN;