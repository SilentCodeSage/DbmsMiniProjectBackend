const express = require("express");
const authRouter = express.Router();
const { db } = require("../config/database");
const bcrypt = require("bcrypt");

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
    const query = "Select * From Users Where email = ? And password_hash = ?";
    const [result] = await db.query(query, [email, password]);
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

module.exports = authRouter;
