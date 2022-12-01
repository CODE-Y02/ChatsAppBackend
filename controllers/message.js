const { Op } = require("sequelize");

const Message = require("../models/message");

// when user send msg
const saveMsg = async (req, res, next) => {
  try {
    const { message, groupId } = req.body;

    if (message === "") {
      //message cannot be null
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Message cannot be Blank",
      });
    }

    let msg;

    if (groupId) {
      msg = await req.user.createMessage({
        content: message,
        groupId,
      });
    } else {
      msg = await req.user.createMessage({
        content: message,
        // senderName: req.user.name,
      });
    }

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
      error: error.message,
    });
  }
};

const getAllmsg = async (req, res, next) => {
  try {
    // get lastMsg id
    let lastMsgId = req.query.lastmessageId;

    if (!lastMsgId && lastMsgId !== 0) {
      lastMsgId = -1;
    }

    // read all message where id > lastMsgid
    let msgArr = await Message.findAll({
      where: {
        id: {
          [Op.gt]: lastMsgId,
        },
        groupId: null,
      },
    });

    // get user name for each msg and clean up response
    msgArr = await msgArr.map(async (each) => {
      let user = await each.getUser();
      const { createdAt, content, updatedAt, id } = each;

      let name = user.name;
      if (user.id === req.user.id) name = "you";

      return { id, content, updatedAt, createdAt, name };
    });

    let messages = await Promise.all(msgArr);

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

const getGroupMsg = async (req, res, next) => {
  try {
    // get lastMsg id
    let lastMsgId = req.query.lastmessageId;

    const groupId = req.params.id;

    if (!lastMsgId && lastMsgId !== 0) {
      lastMsgId = -1;
    }

    // read all message where id > lastMsgid
    let msgArr = await Message.findAll({
      where: {
        id: {
          [Op.gt]: lastMsgId,
        },
        groupId: groupId,
      },
    });

    //
    // get user name for each msg and clean up response
    msgArr = await msgArr.map(async (each) => {
      let user = await each.getUser();
      const { createdAt, content, updatedAt, id } = each;

      let name = user.name;
      if (user.id === req.user.id) name = "you";

      return { id, content, updatedAt, createdAt, name };
    });

    let messages = await Promise.all(msgArr);

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
  getGroupMsg,
};
