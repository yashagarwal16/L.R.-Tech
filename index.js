require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const { connectDB } = require("./db");
const leadRoutes = require("./leadRoutes");
const chatRoutes = require("./chatRoutes");
const feedbackRoutes = require("./feedbackRoutes");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("tiny"));

// Health check — most cloud providers (Render, AWS, Azure) ping this to confirm the app is alive.
app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/leads", leadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

const frontendDirectory = path.join(__dirname, "dist");
app.use(express.static(frontendDirectory));
app.get("*", (req, res, next) => {
  if (path.extname(req.path)) {
    return next();
  }

  res.sendFile(path.join(frontendDirectory, "index.html"), (err) => {
    if (err) next(err);
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] Listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("[server] Failed to start:", err.message);
    process.exit(1);
  });
