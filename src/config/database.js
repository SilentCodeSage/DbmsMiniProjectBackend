const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost", // Replace with your DB host
  user: "root",      // Replace with your DB user
  password: "9562",  // Replace with your DB password
  database: "MiniProject", // Replace with your DB name
});

// Test the connection to the database => by querying
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
  db,
};

// Call the function for immediate feedback
testDatabaseConnection();
