const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("No token ❌");
  }

  try {
    // 🔥 FIX: Bearer remove
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "secretkey");

    if (!decoded.isAdmin) {
      return res.status(403).send("Not Admin ❌");
    }

    req.user = decoded;
    next();

  } catch (err) {
    console.log("JWT ERROR:", err);
    res.status(401).send("Invalid Token ❌");
  }
};

module.exports = verifyAdmin;