const express = require("express");
const cartRouter = express.Router();
const { db } = require("../config/database");
const UserAuth = require("../middlewares/UserAuth");

cartRouter.post("/cart/delete", UserAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const query = "DELETE FROM cart WHERE name = ?";
    const [result] = await db.execute(query, [name]);
    const [ans] = await db.execute("Select * from cart");
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Item deleted successfully." });
    } else {
      res.status(404).json({ message: "Item not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

// Route to delete all items from the cart
cartRouter.post("/cart/clear", UserAuth, async (req, res) => {
  try {
    const query = "DELETE FROM cart";
    const [result] = await db.execute(query);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "All items deleted successfully." });
    } else {
      res.status(200).json({ message: "Cart is already empty." });
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = cartRouter;
