const User = require("../models/user");

const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

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

module.exports = {
  signUp,
};
