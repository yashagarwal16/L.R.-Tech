// This is the ONLY line you change to move to a different database later.
// e.g. const leadRepository = require("./postgresLeadRepository");
const leadRepository = require("./mongoLeadRepository");

module.exports = leadRepository;
