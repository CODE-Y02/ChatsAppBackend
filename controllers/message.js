const { Op } = require("sequelize");

const Message = require("../models/message");
const User = require("../models/user");
const { uploadToS3 } = require("../utils/s3services");

// when user send msg
const saveMsg = async (req, res, next) => {
  try {
    const { file, message } = req;
    // const file = req;
    console.log(req);

    res.json({ "original req": req });

    // console.log("\n\n\n formdata =============> \n\n\n", formData, "\n\n\n\n");
    // console.log(
    //   "\n\n\n message  =============> \n\n\n",
    //   message,
    //   groupId,
    //   "\n\n\n\n"
    // );

    return;

    if (message === "" && !file) {
      //message cannot be null
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Message or file cannot be Blank",
      });
    }

    // if file is passed save file to s3 and get file url from there
    let fileUrl;
    if (file) {
      // console.log("\n\n\n file =============> \n\n\n", req, "\n\n\n\n");

      // fileName format --> UserId /  filname=> "fileDate  . fileExtension "
      const fileName = `File_${req.user.id}/${new Date()}`;
      // fileUrl = await uploadToS3(file, fileName);

      // return res.end();
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
      error,
    });
  }
};

const getAllmsg = async (req, res, next) => {
  try {
    // get lastMsg id
    let lastMsgId = req.query.lastmessageId;

    // console.log("\n\n  messages=====>  \n", lastMsgId, "\n\n");

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

const getGroupMsg = async (req, res, next) => {
  try {
    // get lastMsg id
    let lastMsgId = req.query.lastmessageId;

    const groupId = req.params.id;

    console.log("\n\n  messages=====>  \n", groupId, "\n\n");

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

    // get user name for each msg and clean up response
    msgArr = await msgArr.map(async (each) => {
      let user = await each.getUser();
      const { createdAt, content, updatedAt, id } = each;

      let name = user.name;
      if (user.id === req.user.id) name = "you";

      return { id, content, updatedAt, createdAt, name };
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
  getGroupMsg,
};
