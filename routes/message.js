const express = require("express");
const router = express.Router();

const { authentication } = require("../middlewares/auth");

const { saveMsg, getAllmsg } = require("../controllers/message");

router.post("/send", authentication, saveMsg);

router.get("/getall", authentication, getAllmsg);

module.exports = router;
