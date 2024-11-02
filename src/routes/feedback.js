const express = require("express");
const feedbackRouter = express.Router();
const { db } = require("../config/database");
const UserAuth = require("../middlewares/UserAuth");

// Give feedback
feedbackRouter.post("/feedback",UserAuth, async (req, res) => {
  try {
    user_id = req.currentUser;
    const { rating, comment } = req.body;
    const date = new Date();
    const createdAtDate = new Date(date).toISOString().split("T")[0];
    const query =
      "Insert into Feedback (user_id,rating,comment,created_at) values(?,?,?,?)";

    const [result] = await db.execute(query, [
      user_id,
      rating,
      comment,
      createdAtDate,
    ]);
    res.status(201).json({
      message: "succesfully entered the feedback.",
    });
  } catch (error) {
    console.error(`Feedback entry Error : ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({
      message: "Cannot enter feedback. Please try again",
    });
  }
});
module.exports = feedbackRouter;
