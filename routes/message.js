const express = require("express");
const router = express.Router();

const { authentication } = require("../middlewares/auth");

const { saveMsg, getAllmsg, getGroupMsg } = require("../controllers/message");

router.post("/send", authentication, saveMsg);

// user to user
router.get("/getall", authentication, getAllmsg);

// group msg
router.get("/group/:id", authentication, getGroupMsg);

module.exports = router;
