const twilio = require("twilio");

function getClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

function splitMessage(text, maxLength = 1400) {
  const chunks = [];
  let current = "";

  for (const line of text.split("\n")) {
    let remaining = line;
    while (remaining.length > maxLength) {
      if (current) chunks.push(current);
      chunks.push(remaining.slice(0, maxLength));
      remaining = remaining.slice(maxLength);
      current = "";
    }

    const candidate = current ? `${current}\n${remaining}` : remaining;
    if (candidate.length > maxLength) {
      if (current) chunks.push(current);
      current = remaining;
    } else {
      current = candidate;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

async function sendNewLeadWhatsapp(lead) {
  const client = getClient();
  const message = [
    "📩 *New quote request*",
    `Name: ${lead.name}`,
    `Service: ${lead.service}`,
    `Subject/course: ${lead.subject || "—"}`,
    `Deadline: ${[lead.deadline, lead.deadlineTime].filter(Boolean).join(" ") || "—"}`,
    `WhatsApp: ${lead.whatsapp}`,
    `Email: ${lead.email}`,
    `Pages: ${lead.pages || "—"}`,
    `Attachments (sent by email): ${lead.attachments?.map((file) => file.filename).join(", ") || "None"}`,
    `Contact permission: ${lead.consent ? "Granted" : "Not recorded"}`,
    `Details: ${lead.details || "—"}`,
  ].join("\n");
  const chunks = splitMessage(message);

  await Promise.all(chunks.map((chunk, index) => client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: process.env.NOTIFY_WHATSAPP_TO,
    body: chunks.length > 1 ? `Part ${index + 1}/${chunks.length}\n${chunk}` : chunk,
  })));
}

async function sendCallOutcomeWhatsapp(lead) {
  const client = getClient();
  const { interested, notes } = lead.callOutcome || {};

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: process.env.NOTIFY_WHATSAPP_TO,
    body:
      `📞 *Verification call done*\n` +
      `Name: ${lead.name}\n` +
      `Interested: ${interested === true ? "Yes ✅" : interested === false ? "No ❌" : "Unclear"}\n` +
      `Notes: ${notes || "—"}`,
  });
}

async function sendNewFeedbackWhatsapp(feedback) {
  const client = getClient();
  const body = [
    "📝 *New website feedback*",
    `Rating: ${feedback.rating}/5`,
    `Name: ${feedback.name || "Not provided"}`,
    `Email: ${feedback.email || "Not provided"}`,
    `Publication permission: ${feedback.publishPermission ? "Yes" : "No"}`,
    `Feedback: ${feedback.feedback}`,
    `Feedback ID: ${feedback._id}`,
  ].join("\n");
  const chunks = splitMessage(body);

  await Promise.all(chunks.map((chunk, index) => client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: process.env.NOTIFY_WHATSAPP_TO,
    body: chunks.length > 1 ? `Part ${index + 1}/${chunks.length}\n${chunk}` : chunk,
  })));
}

module.exports = { sendNewLeadWhatsapp, sendCallOutcomeWhatsapp, sendNewFeedbackWhatsapp };
