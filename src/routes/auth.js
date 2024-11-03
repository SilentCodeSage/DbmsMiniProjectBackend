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
    const findPasswordQuerry =
      "Select password_hash From Users Where email = ?";
    const [userHashedPassword] = await db.query(findPasswordQuerry, [email]);
    const isPasswordValid = await bcrypt.compare(
      password,
      userHashedPassword[0].password_hash
    );

    if (!isPasswordValid) throw new Error("Invalid Credentials. Try again.");
    const token = await jwt.sign({ _email: email }, "RES@NANDU$1029");
    res.cookie("token", token);

    const query = "Select * From Users Where email = ? And password_hash = ?";
    const [result] = await db.query(query, [
      email,
      userHashedPassword[0].password_hash,
    ]);
    res.status(201).json({
      status: "success",
      message: "Logged in Succesfully",
      data: result,
    });
  } catch (error) {
    console.error(`Login Error : ${error.message}`, { stack: error.stack });
    res.status(400).json({
      message: "Login Failed. Please try again",
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
