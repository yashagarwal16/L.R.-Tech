const express = require("express");
const { handleChatMessage } = require("./chatController");

const router = express.Router();

router.post("/", handleChatMessage);

module.exports = router;
