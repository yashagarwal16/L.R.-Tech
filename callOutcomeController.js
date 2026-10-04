const leadRepository = require("./mongoLeadRepository");
const { notifyCallOutcome } = require("./notificationService");
const { sendInboundCallSummaryEmail } = require("./emailService");
const mongoose = require("mongoose");

function hasValidWebhookSecret(req) {
  const providedSecret = req.get("x-vapi-secret") || req.get("x-webhook-secret");
  const expectedSecret = process.env.VAPI_WEBHOOK_SECRET || process.env.VOICE_AI_WEBHOOK_SECRET;
  return Boolean(expectedSecret && providedSecret === expectedSecret);
}

function boundedText(value, maxLength) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

function getCallReport(payload) {
  const body = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
  const message = body.message && typeof body.message === "object" && !Array.isArray(body.message)
    ? body.message
    : body;
  const call = message.call && typeof message.call === "object" ? message.call : {};
  const analysis = message.analysis && typeof message.analysis === "object" ? message.analysis
    : call.analysis && typeof call.analysis === "object" ? call.analysis : {};
  const artifact = message.artifact && typeof message.artifact === "object" ? message.artifact
    : call.artifact && typeof call.artifact === "object" ? call.artifact : {};
  const evaluation = analysis.successEvaluation;
  const interested = typeof evaluation === "boolean"
    ? evaluation
    : typeof evaluation === "string" && /^(true|false)$/i.test(evaluation)
      ? evaluation.toLowerCase() === "true"
      : typeof body.interested === "boolean" ? body.interested : null;

  return {
    type: boundedText(message.type || body.type, 100),
    call,
    interested,
    notes: boundedText(analysis.summary || message.summary || body.notes, 10000),
    transcript: boundedText(artifact.transcript || message.transcript || body.transcript, 50000),
    transcriptUrl: boundedText(artifact.recordingUrl || artifact.transcriptUrl || body.transcriptUrl, 2048),
    endedReason: boundedText(call.endedReason || message.endedReason, 200),
    caller: boundedText(call.customer?.number || message.customer?.number, 40),
    leadId: call.metadata?.leadId || message.metadata?.leadId || body.metadata?.leadId,
  };
}

async function saveCallOutcome(id, report) {
  const updates = {
    callOutcome: {
      interested: report.interested,
      notes: report.notes,
      transcriptUrl: report.transcriptUrl,
      calledAt: new Date(),
    },
  };
  if (report.interested === true) updates.status = "verified";
  if (report.interested === false) updates.status = "not_interested";
  const lead = await leadRepository.updateLead(id, updates);
  return lead;
}

async function receiveCallOutcome(req, res) {
  if (!hasValidWebhookSecret(req)) {
    return res.status(401).json({ error: "Invalid webhook secret." });
  }

  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid lead ID." });
  }
  const report = getCallReport(req.body);

  try {
    const lead = await saveCallOutcome(id, report);

    if (!lead) {
      return res.status(404).json({ error: "Lead not found." });
    }

    res.json({ ok: true });

    notifyCallOutcome(lead).catch((err) =>
      console.error("[call-outcome] notifyCallOutcome failed:", err.message)
    );
  } catch (err) {
    console.error("[call-outcome] receiveCallOutcome failed:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Could not save the call outcome." });
    }
  }
}

async function receiveVapiWebhook(req, res) {
  if (!hasValidWebhookSecret(req)) {
    return res.status(401).json({ error: "Invalid webhook secret." });
  }

  const report = getCallReport(req.body);
  if (report.type && report.type !== "end-of-call-report") {
    return res.json({ ok: true, ignored: true });
  }
  if (report.leadId && !mongoose.isValidObjectId(report.leadId)) {
    return res.status(400).json({ error: "Invalid lead ID in call report." });
  }

  try {
    if (report.leadId) {
      const lead = await saveCallOutcome(report.leadId, report);
      if (!lead) return res.status(404).json({ error: "Lead not found." });
      res.json({ ok: true });
      notifyCallOutcome(lead).catch((err) =>
        console.error("[vapi-webhook] notifyCallOutcome failed:", err.message)
      );
      return;
    }

    res.json({ ok: true });
    sendInboundCallSummaryEmail({
      caller: report.caller,
      summary: report.notes,
      transcript: report.transcript,
      endedReason: report.endedReason,
    }).catch((err) =>
      console.error("[vapi-webhook] sendInboundCallSummaryEmail failed:", err.message)
    );
  } catch (err) {
    console.error("[vapi-webhook] receiveVapiWebhook failed:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Could not save the Vapi call report." });
    }
  }
}

module.exports = { receiveCallOutcome, receiveVapiWebhook };
