const jwt = require("jsonwebtoken");
const USER = require("../models/userSchema");
const secretKey = process.env.MY_LOGIN_SECRET_KEY;

const authenticate = async (req, res, next) => {
  try {
    const gettingTokenData = req.headers.authorization;
    const verifyToken = jwt.verify(gettingTokenData, secretKey);
    const rootUser = await USER.findOne({
      _id: verifyToken._id,
      token: gettingTokenData,
    });
    if (!rootUser) {
      throw new Error("Not rootUser");
    }
    req.token = gettingTokenData;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Token not found!" });
  }
};

module.exports = authenticate;
