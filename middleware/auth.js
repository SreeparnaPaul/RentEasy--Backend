const jwt = require("jsonwebtoken");

const revokedTokens = [];
// Middleware to check if the user is authenticated
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // Check if the token is in the revokedTokens list
  if (revokedTokens.includes(token)) {
    return res.status(401).json({ error: "Token revoked" });
  }

  jwt.verify(token, "MyKey", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateJWT, revokedTokens };
