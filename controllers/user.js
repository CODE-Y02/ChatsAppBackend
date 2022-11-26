const User = require("../models/user");

const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

const dotenv = require("dotenv");

// get config vars
dotenv.config();

// jwt
const jwt = require("jsonwebtoken");

const signUp = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // check if user exist
    // let user = await User.findOne({
    //   where: {
    //     [Op.or]: [{ phone }, { email }],
    //   },
    // });

    // console.log(user);
    // if (user) {
    //   //   console.log("if inside");
    //   //if user with email or phone exist then
    //   return res.status(403).json({
    //     success: false,
    //     message: `This ${user.email ? "Email" : "Phone"} is alreay registered `,
    //   });
    // }

    //encrypt pass
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function (err, hash) {
      // Store hash in your password DB.

      if (err) {
        // console.log(err);
        throw new Error("Something Went Wrong");
      } else {
        User.create({
          name,
          email,
          phone,
          password: hash,
        })
          .then((newUser) => {
            res.status(201).json({
              success: true,
              message: "SignUp successfull",
              newUser,
            });
          })
          .catch((error) => {
            // console.log(error);
            return res.status(403).json({
              success: false,
              error: error.message,
              message: " User Already exist ",
            });
          });
      }
    });

    console.log("response send");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error`,
      error,
    });
  }
};

// login in
const logIn = async (req, res) => {
  try {
    // get user info from req
    const { email, password } = req.body;

    // check user exist or not
    let user = await User.findAll({
      where: { email: email },
    });

    if (user.length == 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "You are Not Registered ! signUp ☝️",
          error: " User Not Found",
        });
    }

    // get encryped pass
    const hash = user[0].password;

    // decrypt pass
    bcrypt.compare(password, hash, function (err, result) {
      // result == true -->  success login
      if (err) throw new Error(" Something Went Wrong Try again Later");

      if (result) {
        // user found , login success

        res.status(200).json({
          success: true,
          message: "Login successfull",
          token: generateAccessToken(user[0].id),
        });
      } else {
        // wrong pass
        return res.status(401).json({
          success: false,
          message: "Wrong password",
          error: "User not authorized",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

function generateAccessToken(userId) {
  return jwt.sign({ userId: userId }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
}

module.exports = {
  signUp,
  logIn,
};
