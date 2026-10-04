const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("[db] MONGODB_URI is not set; continuing without MongoDB connection.");
    return;
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);
  console.log("[db] Connected to MongoDB");

  mongoose.connection.on("error", (err) => {
    console.error("[db] Connection error:", err.message);
  });
}

module.exports = { connectDB };
