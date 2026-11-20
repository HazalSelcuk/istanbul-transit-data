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

app.get("/api/hourly", async (req, res) => {
  const date = req.query.date;
  const line = req.query.line;

  const result = await pool.query(
    `
    SELECT f.transition_hour, SUM(f.number_of_passage)::INTEGER AS total_passages
    FROM fact_hourly_ridership f
    JOIN dim_date d ON d.date_id = f.date_id
    JOIN dim_line l ON l.line_id = f.line_id
    WHERE d.full_date = $1 AND l.line_name = $2
    GROUP BY f.transition_hour
    ORDER BY f.transition_hour;
    `,
    [date, line]
  );
  res.json(result.rows);
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});