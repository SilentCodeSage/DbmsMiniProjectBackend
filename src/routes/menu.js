const express = require("express");
const menuRouter = express.Router();
const { db } = require("../config/database");
const UserAuth = require("../middlewares/UserAuth");

// View Menu items
menuRouter.get("/menu/view/:offset", async (req, res) => {
  try {
    let offset = req.params.offset
     offset = parseInt(req.params.offset, 10);
     console.log(offset)
    const query = "select * from Menu limit 10 offset ?";
    const [result] = await db.query(query,[offset]);
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
