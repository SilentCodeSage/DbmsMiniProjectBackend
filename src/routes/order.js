const express = require("express");
const orderRouter = express.Router();
const { db } = require("../config/database");
const UserAuth = require("../middlewares/UserAuth");

// Place an order
orderRouter.post("/order/place", UserAuth, async (req, res) => {
  try {
    const { item_name, quantity, table_number } = req.body;
    const date = new Date();
    const currentUser = req.currentUser;
    const priceOfOrderItem = await db.query(
      "select price from Menu where name = ?",
      [item_name]
    );
    const totalOrderPrice = quantity * priceOfOrderItem[0][0].price;
    const formattedDate = new Date(date).toISOString().split("T")[0];

    const query =
      "Insert into Orders (user_id,Order_date,Status,total_amount,quantity,table_number,item_name) Values(?,?,?,?,?,?,?)";

    const [result] = await db.execute(query, [
      currentUser,
      formattedDate,
      "Order PLaced",
      totalOrderPrice,
      quantity,
      table_number,
      item_name,
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
      "Select order_id,order_date,status,total_amount,quantity,item_name,table_number from Orders where user_id = ?";

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
    const currentUserID = req.currentUser;

    const { name, quantity, price } = req.body;
    const itemname = name;
    const currentquantity = quantity;
    const currentprice = price;

    const [result] = await db.execute("CALL updateCart(?, ?, ?, ?)", [
      currentUserID, // currentUserID
      itemname, // itemname
      currentquantity, // currentquantity
      currentprice, // currentprice
    ]);
    res.status(201).json({
      message: "Succesfully item added to cart",
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

//view Cart

orderRouter.get("/cart/view", UserAuth, async (req, res) => {
  try {
    const user_id = req.currentUser;

    // Query to select all items from the cart for the current user
    const query = "SELECT * FROM cart WHERE user_id = ?";
    const [results] = await db.execute(query, [user_id]);

    // Send the retrieved cart items back in the response
    res.status(200).json(results);
  } catch (error) {
    console.error(`Fetching Cart Items Error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({
      message: "Cannot fetch cart items. Please try again later.",
    });
  }
});

// cancel order

orderRouter.post(
  "/order/cancel/:itemName",
  UserAuth,
  async (req, res) => {
    try {
      const { itemName } = req.params;
      const userId = req.currentUser; 

      console.log("userId:", userId, "itemName:", itemName);

      const cancelOrderQuery =
        "DELETE FROM Orders WHERE user_id = ? AND item_name = ?";
      await db.execute(cancelOrderQuery, [userId, itemName]);

      res.status(200).json({
        message: "Order canceled successfully.",
      });
    } catch (error) {
      console.error(`Canceling Order Error: ${error.message}`, {
        stack: error.stack,
      });
      res.status(500).json({
        message: "Cannot cancel order. Please try again later.",
      });
    }
  }
);


orderRouter.get("/cart/count/:userId", UserAuth, async (req, res) => {
  try {
    const { userId } = req.params; // Extract only userId from URL parameters

    // Query to count all items in the cart for the given user
    const countQuery = `
      SELECT COUNT(*) AS item_count
      FROM cart
      WHERE user_id = ?;
    `;

    // Execute the query with the userId
    const [result] = await db.execute(countQuery, [userId]);

    // Send the count result back in the response
    res.status(200).json({
      userId: userId,
      itemCount: result[0].item_count, // The count will be in the 'item_count' column
    });
  } catch (error) {
    console.error(`Error fetching item count: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({
      message: "Cannot fetch item count. Please try again later.",
    });
  }
});

module.exports = orderRouter;
