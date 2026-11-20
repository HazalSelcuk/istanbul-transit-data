require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

const pool = new Pool({
  host: "localhost",
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

app.get("/", (req, res) => {
  res.send("Istanbul Transit API is running");
});

app.get("/api/daily", async (req, res) => {
  const result = await pool.query(`
    SELECT d.full_date::TEXT AS full_date, d.day_name, SUM(f.number_of_passage)::INTEGER AS total_passages
    FROM fact_hourly_ridership f
    JOIN dim_date d ON d.date_id = f.date_id
    GROUP BY d.full_date, d.day_name
    ORDER BY d.full_date;
  `);
  res.json(result.rows);
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});