const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 100, default: "" },
    email: { type: String, trim: true, lowercase: true, maxlength: 254, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true, trim: true, minlength: 10, maxlength: 3000 },
    publishPermission: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending_review", "approved", "rejected"],
      default: "pending_review",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
