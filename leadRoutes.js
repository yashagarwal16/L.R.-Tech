const express = require("express");
const multer = require("multer");
const { createLead } = require("./leadController");
const { receiveCallOutcome, receiveVapiWebhook } = require("./callOutcomeController");

const router = express.Router();
const allowedMimeTypes = new Map([
  [".pdf", "application/pdf"],
  [".doc", "application/msword"],
  [".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  [".txt", "text/plain"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
]);
const uploadAttachments = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 4, fields: 12, fieldSize: 16 * 1024 },
  fileFilter(req, file, callback) {
    const extension = file.originalname.slice(file.originalname.lastIndexOf(".")).toLowerCase();
    if (allowedMimeTypes.get(extension) !== file.mimetype) {
      return callback(new Error("Attach PDF, DOC, DOCX, TXT, JPG, or PNG files only."));
    }
    callback(null, true);
  },
});

function parseLeadAttachments(req, res, next) {
  uploadAttachments.array("attachments", 4)(req, res, (error) => {
    if (error) {
      const message = error.code === "LIMIT_FILE_SIZE"
        ? "Each attachment must be 5 MB or smaller."
        : error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE"
          ? "You can attach up to 4 files."
          : error.message;
      return res.status(400).json({ error: message });
    }
    if ((req.files || []).reduce((total, file) => total + file.size, 0) > 15 * 1024 * 1024) {
      return res.status(400).json({ error: "Attachments must be 15 MB or smaller in total." });
    }
    return next();
  });
}

router.post("/", parseLeadAttachments, createLead);

router.post("/vapi-webhook", receiveVapiWebhook);
router.post("/:id/call-outcome", receiveCallOutcome);

module.exports = router;
