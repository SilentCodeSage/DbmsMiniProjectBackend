const express = require("express");
const authRouter = express.Router();
const { db } = require("../config/database");

// Signup user
authRouter.post("/signup", async (req, res) => {
  try {
    const { userName, password, email, role } = req.body;
    const query =
      "INSERT INTO Users (username, password_hash, email, role) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(query, [userName, password, email, role]);
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
    const { userName } = req.body;
    const query = "Select * From Users Where userName = ?";
    const [result] = await db.query(query, [userName]);
    res.status(201).json({
      status: "success",
      message: "Logged in Succesfully",
      data: result,
    });
  } catch (error) {
    console.error(`Login Error : ${error.message}`, { stack: error.stack });
    res.status(400).json({
      message: "Login Faile. Please try again",
    });
  }
});

module.exports = authRouter;
