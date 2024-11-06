const express = require("express");
const authRouter = express.Router();
const { db } = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup user
authRouter.post("/signup", async (req, res) => {
  try {
    const { userName, password, email, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO Users (username, password_hash, email, role) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(query, [
      userName,
      hashedPassword,
      email,
      role,
    ]);
    res.status(201).json({
      status: "success",
      message: "User Created Succesfully",
    });
  } catch (error) {
    console.error(`Signup Error : ${error.message}`, { stack: error.stack });
    res.status(400).json({
      message: "Signup Failed. Please try again",
    });
  }
});

// Login user
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }
    // Fetch the hashed password from the database
    const findPasswordQuery = "SELECT password_hash FROM Users WHERE email = ?";
    const [userHashedPassword] = await db.query(findPasswordQuery, [email]);

    // Check if the user exists
    if (userHashedPassword.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }
    

    // Validate the provided password against the stored hash
    const isPasswordValid = await bcrypt.compare(
      password,
      userHashedPassword[0].password_hash
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Generate a JWT token for the user
    const token = await jwt.sign({ _email: email }, "RES@NANDU$1029");
    res.cookie("token", token, { httpOnly: true, secure: true });

    // Fetch the user data to return upon successful login
    const userQuery = "SELECT * FROM Users WHERE email = ?";
    const [userData] = await db.query(userQuery, [email]);
    

    res.status(200).json({
      status: "success",
      message: "Logged in successfully.",
      data: userData,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    // Clear the cookie by setting its maxAge to 0
    res.clearCookie("token");

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(`Logout Error: ${error.message}`, { stack: error.stack });
    res.status(400).json({
      message: "Logout failed. Please try again.",
    });
  }
});

module.exports = authRouter;
