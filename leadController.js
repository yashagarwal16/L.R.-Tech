const leadRepository = require("./mongoLeadRepository");
const { notifyNewLead } = require("./notificationService");
const { triggerVerificationCall } = require("./voiceAiService");

const SERVICES = new Set(["Writing guidance", "Technical tutoring", "Online tutoring"]);
const DEADLINE_TIMES = new Set([
  "08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM",
  "04:00 PM", "06:00 PM", "08:00 PM", "10:00 PM",
]);

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

async function createLead(req, res) {
  const body = req.body || {};
  const fields = ["name", "email", "whatsapp", "service", "subject", "deadline", "deadlineTime", "pages"];
  if (fields.some((field) => typeof body[field] !== "string" || !body[field].trim())) {
    return res.status(400).json({ error: "Complete all required request fields." });
  }
  const name = body.name.trim();
  const email = body.email.trim().toLowerCase();
  const whatsapp = body.whatsapp.trim();
  const subject = body.subject.trim();
  const deadline = body.deadline.trim();
  const deadlineTime = body.deadlineTime.trim();
  const pages = Number(body.pages);
  const details = body.details === undefined ? "" : body.details;

  if (name.length > 100) {
    return res.status(400).json({ error: "Name must be 100 characters or fewer." });
  }
  if (email.length > 254 || !isValidEmail(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  if (whatsapp.length > 32 || !/^\+?[\d\s().-]{6,31}$/.test(whatsapp)) {
    return res.status(400).json({ error: "Enter a valid phone or WhatsApp number." });
  }
  if (!SERVICES.has(body.service.trim())) {
    return res.status(400).json({ error: "Choose a valid support type." });
  }
  if (subject.length > 120) {
    return res.status(400).json({ error: "Subject must be 120 characters or fewer." });
  }
  if (!isValidDate(deadline)) {
    return res.status(400).json({ error: "Enter a valid deadline date." });
  }
  if (!DEADLINE_TIMES.has(deadlineTime)) {
    return res.status(400).json({ error: "Choose a valid preferred time." });
  }
  if (!Number.isInteger(pages) || pages < 1 || pages > 500) {
    return res.status(400).json({ error: "Pages must be a whole number between 1 and 500." });
  }
  if (typeof details !== "string" || details.length > 3000) {
    return res.status(400).json({ error: "Request details must be 3000 characters or fewer." });
  }
  if (body.consent !== "true" && body.consent !== true) {
    return res.status(400).json({ error: "Contact consent is required to submit this request." });
  }

  const files = req.files || [];
  const attachments = files.map((file) => ({
    filename: file.originalname.replace(/\\/g, "/").split("/").pop().replace(/[\r\n\0]/g, "").slice(0, 120) || "attachment",
    mimetype: file.mimetype,
    size: file.size,
  }));

  try {
    const lead = await leadRepository.createLead({
      name,
      email,
      whatsapp,
      service: body.service.trim(),
      subject,
      deadline,
      deadlineTime,
      pages: String(pages),
      details: details.trim(),
      consent: true,
      attachments,
    });

    // Respond to the browser immediately; don't make the visitor wait on email/WhatsApp/db-status updates.
    res.status(201).json({ id: lead._id });

    notifyNewLead(lead, files)
      .then((delivery) => {
        if (delivery.ownerEmail && delivery.ownerWhatsapp) {
          return leadRepository.updateLead(lead._id, { status: "notified" });
        }
        return null;
      })
      .catch((err) => console.error("[leads] notification processing failed:", err.message));

    triggerVerificationCall(lead).catch((err) =>
      console.error("[leads] triggerVerificationCall failed:", err.message)
    );
  } catch (err) {
    console.error("[leads] createLead failed:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Could not save your request. Please try again." });
    }
  }
}

module.exports = { createLead };
