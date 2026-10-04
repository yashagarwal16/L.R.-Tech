/**
 * Data-access layer for leads, backed by MongoDB.
 *
 * The rest of the app (controllers, services) only ever calls the functions
 * exported here — it never imports Mongoose or the Lead model directly.
 */

const Lead = require("./Lead");

async function createLead(data) {
  const lead = await Lead.create(data);
  return lead.toObject();
}

async function findLeadById(id) {
  const lead = await Lead.findById(id);
  return lead ? lead.toObject() : null;
}

async function updateLead(id, updates) {
  const lead = await Lead.findByIdAndUpdate(id, updates, { new: true });
  return lead ? lead.toObject() : null;
}

module.exports = { createLead, findLeadById, updateLead };
