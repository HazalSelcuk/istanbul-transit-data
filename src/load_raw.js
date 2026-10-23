require("dotenv").config();
const fs = require("fs");
const readline = require("readline");
const { Client } = require("pg");

const filePath = "data/hourly_transportation_202406_partial.csv";
const LIMIT = 10000;
const BATCH_SIZE = 1000;
const COLUMN_COUNT = 13;

const client = new Client({
  host: "localhost",
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

const columns = [
  "transition_date", "transition_hour", "transport_type_id", "road_type", "line",
  "transfer_type", "number_of_passage", "number_of_passenger", "product_kind",
  "transaction_type_desc", "town", "line_name", "station_poi_desc_cd",
];

async function insertBatch(rows) {
  const values = [];
  const rowPlaceholders = [];

  for (let i = 0; i < rows.length; i++) {
    const params = [];
    for (let j = 0; j < COLUMN_COUNT; j++) {
      params.push("$" + (i * COLUMN_COUNT + j + 1));
    }
    rowPlaceholders.push("(" + params.join(", ") + ")");
    values.push(...rows[i]);
  }

  const sql =
    "INSERT INTO raw_hourly_transport (" + columns.join(", ") + ") VALUES " +
    rowPlaceholders.join(", ");

  await client.query(sql, values);
}

async function main() {
  console.time("load");
  await client.connect();
  await client.query("TRUNCATE TABLE raw_hourly_transport;");

  const reader = readline.createInterface({
    input: fs.createReadStream(filePath),
  });

  let lineNumber = 0;
  let inserted = 0;
  let batch = [];

  for await (const line of reader) {
    lineNumber++;
    if (lineNumber === 1) continue;

    const parts = line.split(",");
    if (parts.length !== COLUMN_COUNT) continue;

    batch.push(parts);

    if (batch.length === BATCH_SIZE) {
      await insertBatch(batch);
      inserted += batch.length;
      batch = [];
    }

    if (inserted + batch.length >= LIMIT) break;
  }

  if (batch.length > 0) {
    await insertBatch(batch);
    inserted += batch.length;
  }

  console.log("Inserted rows:", inserted);
  console.timeEnd("load");
  await client.end();
}

main();