const express = require("express");
const userRouter = express.Router();
const { db } = require("../config/database");

// GET Users (Already provided)
userRouter.get("/users", async (req, res) => {
  try {
    const { email } = req.query; // Use req.query to get the query parameter
    const query = "SELECT * FROM Users WHERE email = ?";

    // Check if email is provided; if not, fetch all users
    const [users] = email
      ? await db.query(query, [email])
      : await db.query("SELECT * FROM Users");

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({
      message: "An error occurred while fetching users.",
    });
  }
});

// PUT (Update User Profile Data)
userRouter.put("/users/:email", async (req, res) => {
  try {
    const { email } = req.params;  // Get the email from the URL params
    const { username, profileImageUrl, phone } = req.body; // Get the updated data from the request body

    console.log(email)

    // Validate that the necessary data is provided
    if (!username || !profileImageUrl || !phone) {
      return res.status(400).json({
        message: "Username, profile image URL, and phone number are required.",
      });
    }

    

    // SQL query to update user data based on email
    const query = `
      UPDATE Users 
      SET username = ?, image_url = ?, phone_number = ? 
      WHERE email = ?
    `;

    const [result] = await db.query(query, [
      username,
      profileImageUrl,
      phone,
      email,
    ]);

    // If no rows were affected, return a 404 (user not found)
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found or no changes made.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "An error occurred while updating the user profile.",
    });
  }
});

module.exports = userRouter;

