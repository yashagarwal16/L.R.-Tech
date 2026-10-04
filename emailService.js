const nodemailer = require("nodemailer");

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

async function sendNewLeadEmail(lead, files = []) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Website Leads" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL_TO,
    subject: `New quote request — ${lead.name}`,
    html: `
      <h2>New quote request</h2>
      <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
      <p><strong>WhatsApp:</strong> ${escapeHtml(lead.whatsapp)}</p>
      <p><strong>Service:</strong> ${escapeHtml(lead.service)}</p>
      <p><strong>Subject / course:</strong> ${escapeHtml(lead.subject || "—")}</p>
      <p><strong>Deadline:</strong> ${escapeHtml([lead.deadline, lead.deadlineTime].filter(Boolean).join(" ") || "—")}</p>
      <p><strong>Pages / Word Count:</strong> ${escapeHtml(lead.pages || "—")}</p>
      <p><strong>Details:</strong><br/>${escapeHtml(lead.details || "—").replace(/\n/g, "<br/>")}</p>
      <p><strong>Attached files:</strong> ${lead.attachments?.length ? lead.attachments.map((file) => escapeHtml(file.filename)).join(", ") : "None"}</p>
      <p><strong>Contact permission:</strong> ${lead.consent ? "Granted" : "Not recorded"}</p>
      <hr/>
      <p style="color:#888;font-size:12px;">Lead ID: ${lead._id}</p>
    `,
    attachments: files.map((file, index) => ({
      filename: lead.attachments?.[index]?.filename || "attachment",
      content: file.buffer,
      contentType: file.mimetype,
    })),
  });
}

async function sendLeadConfirmationEmail(lead) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"StudySpark" <${process.env.GMAIL_USER}>`,
    to: lead.email,
    subject: "We received your StudySpark request",
    text: [
      `Hi ${lead.name},`,
      "",
      "Thanks for contacting StudySpark. We have received your request and our team will follow up using the contact details you provided.",
      "",
      `Support type: ${lead.service}`,
      `Phone / WhatsApp: ${lead.whatsapp}`,
      `Subject / course: ${lead.subject || "Not specified"}`,
      `Deadline: ${[lead.deadline, lead.deadlineTime].filter(Boolean).join(" ") || "Not specified"}`,
      `Pages / word count: ${lead.pages || "Not specified"}`,
      `Attachments: ${lead.attachments?.map((file) => file.filename).join(", ") || "None"}`,
      `Contact permission: ${lead.consent ? "Granted" : "Not recorded"}`,
      "",
      "Your request details:",
      lead.details || "No additional details provided.",
      "",
      "This is an automatic confirmation; please reply if you need to correct anything.",
    ].join("\n"),
    html: `
      <h2>We received your request</h2>
      <p>Hi ${escapeHtml(lead.name)},</p>
      <p>Thanks for contacting StudySpark. Our team will follow up using the contact details you provided.</p>
      <ul>
        <li><strong>Support type:</strong> ${escapeHtml(lead.service)}</li>
        <li><strong>Phone / WhatsApp:</strong> ${escapeHtml(lead.whatsapp)}</li>
        <li><strong>Subject / course:</strong> ${escapeHtml(lead.subject || "Not specified")}</li>
        <li><strong>Deadline:</strong> ${escapeHtml([lead.deadline, lead.deadlineTime].filter(Boolean).join(" ") || "Not specified")}</li>
        <li><strong>Pages / word count:</strong> ${escapeHtml(lead.pages || "Not specified")}</li>
        <li><strong>Attachments:</strong> ${lead.attachments?.length ? lead.attachments.map((file) => escapeHtml(file.filename)).join(", ") : "None"}</li>
        <li><strong>Contact permission:</strong> ${lead.consent ? "Granted" : "Not recorded"}</li>
      </ul>
      <p><strong>Your request details:</strong><br/>${escapeHtml(lead.details || "No additional details provided.").replace(/\n/g, "<br/>")}</p>
      <p>This is an automatic confirmation; reply if you need to correct anything.</p>
    `,
  });
}

async function sendNewFeedbackEmail(feedback) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"StudySpark Feedback" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL_TO,
    subject: `New website feedback — ${feedback.rating}/5`,
    text: [
      `Rating: ${feedback.rating}/5`,
      `Name: ${feedback.name || "Not provided"}`,
      `Email: ${feedback.email || "Not provided"}`,
      `Permission to consider for publication: ${feedback.publishPermission ? "Yes" : "No"}`,
      "",
      feedback.feedback,
      "",
      `Feedback ID: ${feedback._id}`,
    ].join("\n"),
    html: `
      <h2>New website feedback</h2>
      <p><strong>Rating:</strong> ${feedback.rating}/5</p>
      <p><strong>Name:</strong> ${escapeHtml(feedback.name || "Not provided")}</p>
      <p><strong>Email:</strong> ${escapeHtml(feedback.email || "Not provided")}</p>
      <p><strong>Permission to consider for publication:</strong> ${feedback.publishPermission ? "Yes" : "No"}</p>
      <p><strong>Feedback:</strong><br/>${escapeHtml(feedback.feedback).replace(/\n/g, "<br/>")}</p>
      <p style="color:#888;font-size:12px;">Feedback ID: ${escapeHtml(feedback._id)}</p>
    `,
  });
}

async function sendFeedbackConfirmationEmail(feedback) {
  if (!feedback.email) return;
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"StudySpark" <${process.env.GMAIL_USER}>`,
    to: feedback.email,
    subject: "Thanks for sharing feedback with StudySpark",
    text: `Hi${feedback.name ? ` ${feedback.name}` : ""},\n\nThank you for your feedback. Our team has received it and will use it to improve the StudySpark experience. Feedback is not published automatically.\n\nThe StudySpark team`,
    html: `<p>Hi${feedback.name ? ` ${escapeHtml(feedback.name)}` : ""},</p><p>Thank you for your feedback. Our team has received it and will use it to improve the StudySpark experience. Feedback is not published automatically.</p><p>The StudySpark team</p>`,
  });
}

async function sendCallOutcomeEmail(lead) {
  const transporter = getTransporter();
  const { interested, notes, calledAt } = lead.callOutcome || {};

  await transporter.sendMail({
    from: `"Website Leads" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL_TO,
    subject: `Call verification result — ${lead.name} (${interested ? "Interested" : "Not interested / unclear"})`,
    html: `
      <h2>Verification call completed</h2>
      <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Interested:</strong> ${interested === true ? "Yes" : interested === false ? "No" : "Unclear"}</p>
      <p><strong>Called at:</strong> ${calledAt || "—"}</p>
      <p><strong>Notes / summary:</strong><br/>${escapeHtml(notes || "—").replace(/\n/g, "<br/>")}</p>
      <hr/>
      <p style="color:#888;font-size:12px;">Lead ID: ${lead._id}</p>
    `,
  });
}

async function sendInboundCallSummaryEmail({ caller, summary, transcript, endedReason }) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"StudySpark Calls" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL_TO,
    subject: `Vapi call summary — ${caller || "Unknown caller"}`,
    html: `
      <h2>Vapi call completed</h2>
      <p><strong>Caller:</strong> ${escapeHtml(caller || "Unavailable")}</p>
      <p><strong>Outcome:</strong> ${escapeHtml(endedReason || "Unavailable")}</p>
      <p><strong>Summary:</strong><br/>${escapeHtml(summary || "No summary was provided.").replace(/\n/g, "<br/>")}</p>
      ${transcript ? `<details><summary>Transcript</summary><pre>${escapeHtml(transcript)}</pre></details>` : ""}
    `,
  });
}

module.exports = {
  sendNewLeadEmail,
  sendLeadConfirmationEmail,
  sendNewFeedbackEmail,
  sendFeedbackConfirmationEmail,
  sendCallOutcomeEmail,
  sendInboundCallSummaryEmail,
};
