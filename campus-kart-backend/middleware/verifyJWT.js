const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid authorization header" });
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // Attach decoded payload to req.user so that it is available in subsequent handlers.
    // Ensure your JWT generation includes the seller's ID as "id"
    req.user = decoded;
    console.log(req.user);
    next();
  });
};

module.exports = verifyJWT;
