const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

pool.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )
`).then(() => console.log("✅ contacts table ready"))
  .catch(err => console.error("Table error:", err));

app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

// GET all messages — for admin page
app.get("/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contacts ORDER BY id DESC"
    );
    res.json({ messages: result.rows });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ messages: [] });
  }
});

// POST contact form
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});