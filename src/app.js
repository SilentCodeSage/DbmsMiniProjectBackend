const express = require("express");
const { testDatabaseConnection, db } = require("./config/database");
const authRouter = require("./routes/auth");
const reservationRouter = require("./routes/reservation");
const menuRouter = require("./routes/menu");
const orderRouter = require("./routes/order");
const feedbackRouter = require("./routes/feedback");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cartRouter = require("./routes/cart");
const userRouter = require("./routes/users");

const app = express();
const port = 3004;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", reservationRouter);
app.use("/", menuRouter);
app.use("/", orderRouter);
app.use("/", feedbackRouter);
app.use("/", cartRouter);
app.use("/",userRouter);
// If connection succes then listen to port
testDatabaseConnection().then(() => {
  try {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(
      "Failed to start the server due to database connection error:",
      err
    );
  }
});

app.get("/", async (req, res) => {
  const query = "SELECT * FROM Users";
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send("Internal Server Error");
  }
});
