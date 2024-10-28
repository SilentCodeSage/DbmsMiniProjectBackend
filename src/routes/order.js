const express = require("express");
const orderRouter = express.Router();
const { db } = require("../config/database");

// Place an order
orderRouter.post("/order/place", async (req, res) => {
  try {
    const { User_id, Item_id, Quantity } = req.body;
    const date = new Date();

    const priceOfOrderItem = await db.query(
      "select price from Menu where item_id = ?",
      [Item_id]
    );
    const totalOrderPrice = Quantity * priceOfOrderItem[0][0].price;
    const formattedDate = new Date(date).toISOString().split("T")[0];

    const query =
      "Insert into Orders (User_id,Order_date,Status,Total_amount,Item_id,Quantity) Values(?,?,?,?,?,?)";

    const [result] = await db.execute(query, [
      User_id,
      formattedDate,
      "Order PLaced",
      totalOrderPrice,
      Item_id,
      Quantity,
    ]);

    res.status(201).json({
      message: "Order has been placed succesfully",
    });
  } catch (error) {
    console.error(`Order place Error : ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({
      message: "Cannot Place Order. Please try again",
    });
  }
});

module.exports = orderRouter;