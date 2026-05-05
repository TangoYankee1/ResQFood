// backend/middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error("An error occurred:", err.stack || err);
  res.status(500).json({ message: "Internal Server Error" });
}

module.exports = errorHandler;