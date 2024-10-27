const express = require("express");
const reservationRouter = express.Router();
const { db } = require("../config/database");

// reserve a table
reservationRouter.post("/reserve/table", async (req, res) => {
  try {
    const { user_id, date, time, table_number } = req.body;
    const query =
      "insert into Reservations (user_id,date,time,table_number) VALUES(?,?,?,?)";
    const [result] = await db.execute(query, [
      user_id,
      date,
      time,
      table_number,
    ]);
    res.status(201).json({
      status: "success",
      message: "Reservation completed Succesfully",
    });
  } catch (error) {
    console.error(`Reservation Error : ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({
      message: "Reservation Failed. Please try again",
    });
  }
});

module.exports = reservationRouter;
