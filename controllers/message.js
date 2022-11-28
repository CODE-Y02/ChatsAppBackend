const Message = require("../models/message");
const User = require("../models/user");

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

    let msg = await req.user.createMessage({
      content: message,
      // senderName: req.user.name,
    });

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

const getAllmsg = async (req, res, next) => {
  try {
    // read all message
    let msgArr = await Message.findAll();

    // get user name for each msg and clean up response
    msgArr = await msgArr.map(async (each) => {
      let user = await each.getUser();
      const { createdAt, content, userId, updatedAt } = each;
      let { name, id } = user;

      if (id === req.user.id) name = "you";

      return { content, userId, updatedAt, createdAt, name };
    });

    let messages = await Promise.all(msgArr);
    // console.log("\n\n  messages=====>  \n", messages, "\n\n");
    res.status(200).json(messages);
  } catch (error) {
    console.log("\n\n error in get ALL msg \n", error, "\n\n");
    res.status(500).json({
      success: false,
      message: `Internal Server Error`,
      error: error.message,
    });
  }
};

module.exports = {
  saveMsg,
  getAllmsg,
};
