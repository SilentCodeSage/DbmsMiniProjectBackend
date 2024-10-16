const mysql = require("mysql2/promise"); // Use the promise version

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "9562",
  database: "MiniProject",
});

// Test the connection to the database
async function testDatabaseConnection() {
  try {
    await db.query("SELECT 1");
    console.log("Connected to the database!");
  } catch (err) {
    console.error("Error connecting to the database:", err.stack);
    throw err;
  }
}

module.exports = {
  testDatabaseConnection,
  db
};
