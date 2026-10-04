const RESPONSES = [
  {
    match: /\b(price|pricing|cost|quote|fee|discount)\b/i,
    reply: "Pricing depends on the subject, scope, and timeline. Share a few details in the request form and our team will explain the options before you decide.",
  },
  {
    match: /\b(deadline|urgent|due|rush|time)\b/i,
    reply: "We can check what support is realistic for your timeline. Include your due date in the request form so the team can advise you.",
  },
  {
    match: /\b(privacy|private|confidential|data)\b/i,
    reply: "Your contact details and request are kept private and used to respond to you and provide support.",
  },
  {
    match: /\b(essay|writing|proofread|edit|citation)\b/i,
    reply: "We offer writing guidance, editing feedback, citation help, and support with structure while keeping the work yours.",
  },
  {
    match: /\b(research|dissertation|thesis|methodology)\b/i,
    reply: "Our research support can help with topic development, finding sources, methodology, and planning your dissertation.",
  },
  {
    match: /\b(service|services|offer|offers|support areas)\b/i,
    reply: "StudySpark offers writing and editing guidance, research planning, subject tutoring, project feedback, and exam preparation. We help you understand and develop your own work.",
  },
  {
    match: /\b(tutor|subject|expert|specialist|match|guidance)\b/i,
    reply: "Tell us your subject and goals in the request form. We’ll help find a specialist whose experience fits your needs.",
  },
  {
    match: /\b(file|files|attach|attachment|upload|brief|document)\b/i,
    reply: "You can attach up to four PDF, DOC, DOCX, TXT, JPG, or PNG files to the request form. Each file can be up to 5 MB (15 MB total).",
  },
  {
    match: /\b(call|phone|whatsapp|contact|human|person|team)\b/i,
    reply: "You can call or message us using the contact buttons, or leave your details in the request form and the team will get back to you.",
  },
];

async function handleChatMessage(req, res) {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }
  const latestMessage = messages[messages.length - 1];
  if (
    !latestMessage ||
    latestMessage.role !== "user" ||
    typeof latestMessage.text !== "string" ||
    latestMessage.text.trim().length === 0 ||
    latestMessage.text.length > 1000
  ) {
    return res.status(400).json({ error: "The latest message must be a non-empty text string under 1000 characters." });
  }

  const match = RESPONSES.find(({ match: pattern }) => pattern.test(latestMessage.text));
  const reply = match
    ? match.reply
    : "I can help with services, deadlines, privacy, or getting started. Tell me a little more, or send your question through the request form for personal support.";
  return res.json({ reply });
}

module.exports = { handleChatMessage };
