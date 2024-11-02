const express = require("express");
const orderRouter = express.Router();
const { db } = require("../config/database");
const UserAuth = require("../middlewares/UserAuth");

// Place an order
orderRouter.post("/order/place", UserAuth, async (req, res) => {
  try {
    const { Item_id, Quantity } = req.body;
    const date = new Date();
    const currentUser = req.currentUser;
    const priceOfOrderItem = await db.query(
      "select price from Menu where item_id = ?",
      [Item_id]
    );
    const totalOrderPrice = Quantity * priceOfOrderItem[0][0].price;
    const formattedDate = new Date(date).toISOString().split("T")[0];

    const query =
      "Insert into Orders (User_id,Order_date,Status,Total_amount,Item_id,Quantity) Values(?,?,?,?,?,?)";

    const [result] = await db.execute(query, [
      currentUser,
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

// View Orders
orderRouter.get("/order/view", UserAuth, async (req, res) => {
  try {
    const user_id = req.currentUser;
    const query =
      "Select order_date,status,total_amount,quantity from Orders where user_id = ?";

    const [result] = await db.query(query, [user_id]);
    res.status(201).json({
      result: result,
    });
  } catch (error) {
    console.error(`Order view Error : ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({
      message: "Cannot view Orders. Please try again",
    });
  }
});

// Add to cart

orderRouter.post("/cart/add", UserAuth, async (req, res) => {
  try {
    const user_id = req.currentUser;

    const {  item_id ,quantity} = req.body;
    console.log(user_id,item_id ,quantity)
    const query = "Insert into cart (user_id, Item_id ,quantity) values(?,?,?)";
    const [result] =  await db.execute(query,[user_id,item_id ,quantity]);
    res.status(201).json({
      message:"Succesfully item added to cart",
      result: result,
    });
  } catch (error) {
    console.error(`Adding item to Cart Error : ${error.message}`, {
      stack: error.stack,
    });
    res.status(400).json({
      message: "Cannot Add to  Cart. Please try again",
    });
  }
});

module.exports = orderRouter;
