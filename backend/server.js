const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

// create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL
  )
`).then(() => console.log("✅ contacts table ready"))
  .catch(err => console.error("Table error:", err));

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});