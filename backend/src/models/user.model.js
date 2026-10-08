import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is requiredj"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
