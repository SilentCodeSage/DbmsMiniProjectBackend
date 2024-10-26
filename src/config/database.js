const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

// Test the connection to the database => by quering
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
