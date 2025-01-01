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

// get the reservation id for the the user
reservationRouter.get("/reserve/all", UserAuth, async (req, res) => {
  try {
    const currentUser = req.currentUser;

    const query = `
      SELECT reservation_id
      FROM Reservations
      WHERE user_id = ?
    `;
    const [results] = await db.execute(query, [currentUser]);

    // Check if any reservations exist
    if (results.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No reservations found for the current user",
      });
    }

    // Send back all reservation IDs as an array
    const reservationIds = results.map(row => row.reservation_id);
    res.status(200).json({
      status: "success",
      message: "Reservations retrieved successfully",
      reservation_ids: reservationIds,
    });
  } catch (error) {
    console.error(`Reservation Retrieval Error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({
      message: "Failed to retrieve reservations. Please try again",
    });
  }
});

// get the details from Tables
reservationRouter.get("/tableinfo",UserAuth,async(req,res) =>{
  try {
    const tableType = req.query.tableType;
    const seating_capacity = req.query.seating_capacity;
    const query = "Select table_id,seating_capacity,availability,description  from Tables where availability > 0 and description = ? and seating_capacity = ?";
    const result = await db.execute(query, [tableType, seating_capacity]);

    console.log(result);
    res.send(result[0]);
  } catch (error) {
    
  }
})


module.exports = reservationRouter;
