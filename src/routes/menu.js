const express = require("express");
const menuRouter = express.Router();
const { db } = require("../config/database");

// View Menu items
menuRouter.get("/menu/view", async (req, res) => {
  try {
    const query = "select * from Menu";
    const [result] = await db.query(query);
    console.log(result);
    result.length > 0 && res.status(201).json(result);
  } catch (error) {
    console.error(`Menu View Error : ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({
      message: "View Menu Failed. Please try again",
    });
  }
});

module.exports = menuRouter;
