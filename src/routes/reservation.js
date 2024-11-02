const express = require("express");
const reservationRouter = express.Router();
const { db } = require("../config/database");
const UserAuth = require("../middlewares/UserAuth");

// reserve a table
reservationRouter.post("/reserve/table", UserAuth, async (req, res) => {
  try {
    const { date, time, people } = req.body;
    console.log(date, time, people);
    const currentUser = req.currentUser;
    const query =
      "insert into Reservations (user_id,date,time,table_number) VALUES(?,?,?,?)";
    const [result] = await db.execute(query, [currentUser, date, time, people]);
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
