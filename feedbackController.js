const feedbackRepository = require("./feedbackRepository");
const { notifyNewFeedback } = require("./notificationService");

function createFeedback(req, res) {
  const { name = "", email = "", rating, feedback, publishPermission = false } = req.body || {};
  const trimmedFeedback = typeof feedback === "string" ? feedback.trim() : "";
  const numericRating = Number(rating);
  const emailAddress = typeof email === "string" ? email.trim() : "";

  if (typeof name !== "string" || name.trim().length > 100) {
    return res.status(400).json({ error: "Name must be 100 characters or fewer." });
  }
  if (emailAddress && (emailAddress.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress))) {
    return res.status(400).json({ error: "Enter a valid email address or leave it blank." });
  }
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: "Choose a rating from 1 to 5." });
  }
  if (trimmedFeedback.length < 10 || trimmedFeedback.length > 3000) {
    return res.status(400).json({ error: "Feedback must be between 10 and 3000 characters." });
  }
  if (typeof publishPermission !== "boolean") {
    return res.status(400).json({ error: "Publication permission must be true or false." });
  }

  feedbackRepository.createFeedback({
    name: name.trim(),
    email: emailAddress,
    rating: numericRating,
    feedback: trimmedFeedback,
    publishPermission,
  })
    .then((savedFeedback) => {
      res.status(201).json({ id: savedFeedback._id });
      notifyNewFeedback(savedFeedback).catch((error) =>
        console.error("[feedback] notification processing failed:", error.message)
      );
    })
    .catch((error) => {
      console.error("[feedback] createFeedback failed:", error.message);
      if (!res.headersSent) {
        res.status(500).json({ error: "Could not save your feedback. Please try again." });
      }
    });
}

module.exports = { createFeedback };
