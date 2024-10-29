const express = require("express");
const reportRouter = express.Router();
const { db } = require("../config/database");

// view reports
reportRouter.post("/reports", async (req, res) => {
  try {
    
  } catch (error) {
    console.error(`Report Fetch Error : ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({
      message: "Cannot fetch reports. Please try again",
    });
  }
});

module.exports = reportRouter;
