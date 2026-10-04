const {
  sendNewLeadEmail,
  sendLeadConfirmationEmail,
  sendNewFeedbackEmail,
  sendFeedbackConfirmationEmail,
  sendCallOutcomeEmail,
} = require("./emailService");
const { sendNewLeadWhatsapp, sendCallOutcomeWhatsapp, sendNewFeedbackWhatsapp } = require("./whatsappService");

// Fires both notifications for a brand-new form submission.
// Each channel is wrapped so one failing (e.g. bad Twilio creds) never blocks the other.
async function notifyNewLead(lead, attachments = []) {
  const channels = [
    ["owner email", sendNewLeadEmail(lead, attachments)],
    ["owner WhatsApp", sendNewLeadWhatsapp(lead)],
    ["requester confirmation email", sendLeadConfirmationEmail(lead)],
  ];
  const results = await Promise.allSettled(channels.map(([, delivery]) => delivery));

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`[notify] Failed to send ${channels[index][0]}:`, result.reason.message);
    }
  });

  return {
    ownerEmail: results[0].status === "fulfilled",
    ownerWhatsapp: results[1].status === "fulfilled",
    requesterEmail: results[2].status === "fulfilled",
  };
}

async function notifyNewFeedback(feedback) {
  const channels = [
    ["owner feedback email", sendNewFeedbackEmail(feedback)],
    ["owner feedback WhatsApp", sendNewFeedbackWhatsapp(feedback)],
    ["feedback confirmation email", sendFeedbackConfirmationEmail(feedback)],
  ];
  const results = await Promise.allSettled(channels.map(([, delivery]) => delivery));

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`[notify] Failed to send ${channels[index][0]}:`, result.reason.message);
    }
  });
}

// Fires both notifications once a verification call outcome comes back
// (from the future voice-AI layer — see voiceAiService.js).
async function notifyCallOutcome(lead) {
  const results = await Promise.allSettled([sendCallOutcomeEmail(lead), sendCallOutcomeWhatsapp(lead)]);

  results.forEach((result, idx) => {
    if (result.status === "rejected") {
      const channel = idx === 0 ? "email" : "whatsapp";
      console.error(`[notify] Failed to send call-outcome ${channel}:`, result.reason.message);
    }
  });
}

module.exports = { notifyNewLead, notifyNewFeedback, notifyCallOutcome };
