const jwt = require("jsonwebtoken");
const { db } = require("../config/database");

const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) return res.status(401).send("Authentication token is required");

    const decoded = jwt.verify(token, "RES@NANDU$1029");
    console.log(decoded)
    const query = "Select user_id from Users where email = ?";
    const [result] = await db.query(query, [decoded._email]);
    req.currentUser = result[0]?.user_id;
    next();
  } catch (error) {
    console.log(error); 
  } 
};

module.exports = UserAuth;
