async function triggerVerificationCall(lead) {
  if (process.env.ENABLE_VOICE_VERIFICATION !== "true") return;

  const required = ["VAPI_PRIVATE_KEY", "VAPI_ASSISTANT_ID", "VAPI_PHONE_NUMBER_ID"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Vapi is enabled but missing configuration: ${missing.join(", ")}`);
  }

  const response = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assistantId: process.env.VAPI_ASSISTANT_ID,
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      customer: { number: lead.whatsapp, name: lead.name },
      metadata: { leadId: String(lead._id) },
      assistantOverrides: {
        variableValues: {
          customerName: lead.name,
          requestedService: lead.service,
          deadline: lead.deadline || "not specified",
        },
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Vapi call request failed (${response.status}): ${details}`);
  }

  const call = await response.json();
  console.info(`[vapi] Call ${call.id || "created"} started for lead ${lead._id}`);
}

module.exports = { triggerVerificationCall };
