const mongoose = require("mongoose");

const callOutcomeSchema = new mongoose.Schema(
  {
    interested: { type: Boolean, default: null },
    notes: { type: String, maxlength: 10000, default: "" },
    transcriptUrl: { type: String, maxlength: 2048, default: "" },
    calledAt: { type: Date, default: null },
  },
  { _id: false }
);

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    whatsapp: { type: String, required: true, trim: true, maxlength: 32 },
    service: {
      type: String,
      required: true,
      trim: true,
      enum: ["Writing guidance", "Technical tutoring", "Online tutoring"],
    },
    deadline: { type: String, required: true, trim: true, maxlength: 10 },
    deadlineTime: { type: String, required: true, trim: true, maxlength: 8 },
    pages: { type: String, required: true, trim: true, maxlength: 3 },
    subject: { type: String, required: true, trim: true, maxlength: 120 },
    details: { type: String, trim: true, maxlength: 3000 },
    consent: { type: Boolean, required: true, default: false },
    attachments: [{
      filename: { type: String, required: true, maxlength: 120 },
      mimetype: { type: String, required: true, maxlength: 100 },
      size: { type: Number, required: true },
    }],

    // new -> notified -> (optionally) call_scheduled -> verified -> converted / not_interested
    status: {
      type: String,
      enum: ["new", "notified", "call_scheduled", "verified", "converted", "not_interested"],
      default: "new",
    },

    callOutcome: { type: callOutcomeSchema, default: () => ({}) },

    source: { type: String, default: "landing_page_form" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
