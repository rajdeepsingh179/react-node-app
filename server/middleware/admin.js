const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader) {
      return res.status(401).json({ message: "No token ❌" });
    }

    // 🔥 Extract token
    const token = authHeader.split(" ")[1];

    // ❌ Token missing
    if (!token) {
      return res.status(401).json({ message: "Token missing ❌" });
    }

    // ✅ Verify using ENV secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ❌ Not admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Not Admin ❌" });
    }

    // ✅ attach user
    req.user = decoded;

    next();

  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token ❌" });
  }
};

module.exports = verifyAdmin;