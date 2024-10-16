const express = require("express");
const { testDatabaseConnection, db } = require("./config/database");

const app = express();
const port = 3000;

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
  const query = "SELECT * FROM users";
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send("Internal Server Error");
  }
});
