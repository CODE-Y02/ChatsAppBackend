// THIS FILE WILL CONTAIN ALL AUTH RELATED MIDDLEWARES

const dotenv = require("dotenv");

// get config vars
dotenv.config();

// jwt
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authentication = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    const userObj = jwt.verify(token, process.env.TOKEN_SECRET);
    // console.log("\n \n ", userObj);

    let user = await User.findByPk(userObj.userId);

    // console.log(user);
    req.user = user; // very Imp
    next();
  } catch (error) {
    console.log(" \n ERR in AUTH ", error);
    return res.status(401).json({ success: false });
  }
};

module.exports = {
  authentication,
};
