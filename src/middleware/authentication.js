require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];

  try {
    if (!token) {
      throw new Error("No token provided");
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({
          status: false,
          message: "Invalid token",
        });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(401).json({
      status: false,
      message: "Unauthorized access",
    });
  }
};

module.exports = {
  authenticateToken,
};
