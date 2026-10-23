require("dotenv").config();
const fs = require("fs");
const readline = require("readline");
const { Client } = require("pg");

const filePath = "data/hourly_transportation_202406_partial.csv";
const LIMIT = 10;

const client = new Client({
  host: "localhost",
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

const insertSql = `
  INSERT INTO raw_hourly_transport (
    transition_date, transition_hour, transport_type_id, road_type, line,
    transfer_type, number_of_passage, number_of_passenger, product_kind,
    transaction_type_desc, town, line_name, station_poi_desc_cd
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
`;

async function main() {
  await client.connect();
  await client.query("TRUNCATE TABLE raw_hourly_transport;");

  const reader = readline.createInterface({
    input: fs.createReadStream(filePath),
  });

  let lineNumber = 0;
  let inserted = 0;

  for await (const line of reader) {
    lineNumber++;
    if (lineNumber === 1) continue;

    const parts = line.split(",");
    if (parts.length !== 13) continue;

    await client.query(insertSql, parts);
    inserted++;

    if (inserted >= LIMIT) break;
  }

  console.log("Inserted rows:", inserted);
  await client.end();
}

main();