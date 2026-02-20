const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/express/contactRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT_EXPRESS || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/contacts", contactRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Contact API (Express) is running" });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
});

module.exports = app;
