const jwt = require("jsonwebtoken");
const { User } = require("../models/User");


const auth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decode = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decode.id);

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ status: false, message: "Not authorized, invaild token" });
    }
  }

  if (!token) {
    res.status(401).json({ status: false, message: "Not authorized, no token" });
  }
};

module.exports = { auth };
