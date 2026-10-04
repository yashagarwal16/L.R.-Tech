const Feedback = require("./Feedback");

async function createFeedback(data) {
  const feedback = await Feedback.create(data);
  return feedback.toObject();
}

module.exports = { createFeedback };
