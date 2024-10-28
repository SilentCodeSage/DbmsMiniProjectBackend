const express = require("express");
const { testDatabaseConnection, db } = require("./config/database");
const authRouter = require("./routes/auth");
const reservationRouter = require("./routes/reservation");
const menuRouter = require("./routes/menu");
const orderRouter = require("./routes/order");
const app = express();
const port = 3004;


app.use(express.json());
app.use('/', authRouter);
app.use('/', reservationRouter);
app.use('/',menuRouter);
app.use('/',orderRouter);


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
