const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token ❌" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Not admin ❌" });
    }

    req.user = decoded;
    next();

  } catch (err) {
    console.log("ADMIN TOKEN ERROR:", err);
    return res.status(401).json({ message: "Invalid token ❌" });
  }
};

module.exports = verifyAdmin;