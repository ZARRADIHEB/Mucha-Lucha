import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: String,
  otpExpiry: Date,
  role: {
    type: String,
    default: "user",
  },
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
