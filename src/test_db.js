require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

async function main() {
  await client.connect();
  const result = await client.query("SELECT COUNT(*) FROM raw_hourly_transport;");
  console.log("Rows in table:", result.rows[0].count);
  await client.end();
}

main();