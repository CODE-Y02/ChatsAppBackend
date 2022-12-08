const { Op } = require("sequelize");
const fs = require("fs");

const Message = require("../models/message");

const { uploadToS3 } = require("../utils/s3services");

// when user send msg
const saveMsg = async (req, res, next) => {
  try {
    const { file } = req;

    let { message, groupId } = req.body;

    groupId = Number(groupId);

    if (!message && !file) {
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
      let readyFile = fs.readFileSync(file.path);

      // fileName format --> UserId /  filname=> "fileDate  . fileExtension "
      const fileName = `File_${req.user.id}/${new Date()}/${file.originalname}`;

      // fileUrl = await uploadToS3(readyFile, fileName);
    }

    // create msg in db
    let msg = await req.user.createMessage({
      content: message,
      fileUrl,
      groupId,
    });

    // once msg is stored in DB send response to user msg send
    res.status(201).json({
      success: true,
      message: "Message send successfully",
      msg,
    });

    // clean up file from sperver
    if (file) {
      fs.unlink(file.path, (err) => {
        if (err) console.log("error in deleting file from ", file.path, "\n\n");
      });

      // clean up action ends
    }
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
      const { createdAt, content, updatedAt, id, fileUrl } = each;

      let name = user.name;
      if (user.id === req.user.id) name = "you";

      return { id, content, updatedAt, createdAt, name, fileUrl };
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
      const { createdAt, content, updatedAt, id, fileUrl } = each;

      let name = user.name;
      if (user.id === req.user.id) name = "you";

      return { id, content, updatedAt, createdAt, name, fileUrl };
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
