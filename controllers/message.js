// const Message = require("../models/message");
// const User = require("../models/user");

// when user send msg
const saveMsg = async (req, res, next) => {
  try {
    const { message } = req.body;

    // console.log(req.body);

    if (message === "") {
      //message cannot be null
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Message cannot be Blank",
      });
    }

    let msg = await req.user.createMessage({ content: message });

    // once msg is stored in DB send response to user msg send
    res.status(201).json({
      success: true,
      message: "Message send successfully",
      msg,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Internal Server Error`,
      error,
    });
  }
};

const readMsg = async (req, res, next) => {
  try {
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
  saveMsg,
  readMsg,
};
