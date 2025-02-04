import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";

//register
const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const missingFields = [];
    if (!userName) missingFields.push("Username");
    if (!email) missingFields.push("Email");
    if (!password) missingFields.push("Password");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Please fill these fields: ${missingFields.join(", ")}`,
        success: false,
      });
    }

    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(409).json({
        message: "Email already registered",
        success: false,
      });
    }

    if (password.length < 8) {
      return res.status(422).json({
        message: "Password must be at least 8 characters long",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//login

const login = async (params) => {
  try {
  } catch (error) {
    console.log(error.message || error);
    res.status(500).json({
      message: "Internal server problem",
      success: false,
    });
  }
};

//logout

//auth middleware

export { register, login, logout };
