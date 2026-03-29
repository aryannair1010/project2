const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// test route
app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

// save contact form data
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    console.log("Saved to DB ✅");

    res.json({ success: true });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ success: false });
  }
});

// start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});