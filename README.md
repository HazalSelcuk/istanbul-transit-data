# Istanbul Transit Data Platform

This project is a data pipeline that processes hourly public transport data published monthly by the Istanbul Metropolitan Municipality. It loads the data into a PostgreSQL database, cleans and validates it, and models it as a star schema for analysis. The results are served through a REST API and displayed as charts on a web dashboard.

## Architecture

```
IBB CSV → raw → staging → mart (star schema) → Express API → Vue dashboard
```

- **raw:** An exact copy of the CSV file, all columns stored as text.
- **staging:** Data types corrected and empty values converted to NULL. Quality checks run on this layer.
- **mart:** A star schema with one fact table (`fact_hourly_ridership`) and three dimension tables (`dim_date`, `dim_line`, `dim_product`).

## Tech Stack

- Node.js: Reads CSV files and loads them into the database.
- PostgreSQL: The database where data is stored.
- SQL: Cleaning, modeling, and querying data.
- Express.js: The REST API that serves data to the dashboard.
- Vue.js + Chart.js: The web dashboard where the charts are displayed.
- Docker: Runs PostgreSQL in a container.

## Project Structure

```
sql/         SQL scripts, numbered in the order they run
src/         Node.js scripts (data loader and API server)
dashboard/   Vue.js dashboard
docs/        Notes on the data and issues found
```

## Quick Start (Docker Compose)

If the database is already loaded, the whole system starts with one command:

```bash
docker compose up -d
```

- Dashboard: http://localhost:8080
- API: http://localhost:3000

To stop it:

```bash
docker compose down
```

The database data is stored in the external `transit-pgdata` volume, so it is kept when the containers are removed.

## How to Run

1. Start PostgreSQL in Docker:
   ```bash
   docker run -d --name transit-postgres -e POSTGRES_USER=<user> -e POSTGRES_PASSWORD=<password> -e POSTGRES_DB=transit -p 5433:5432 -v transit-pgdata:/var/lib/postgresql/data postgres:17
   ```
2. Create a `.env` file in the project root:
   ```
   POSTGRES_USER=<user>
   POSTGRES_PASSWORD=<password>
   POSTGRES_DB=transit
   POSTGRES_PORT=5433
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Download the hourly transport CSV from the IBB Open Data Portal into the `data/` folder. The file path is set in `src/load_raw.js`.
5. Create the raw table and load the CSV:
   ```bash
   docker exec -i transit-postgres psql -U <user> -d transit < sql/01_create_raw_table.sql
   node src/load_raw.js
   ```
6. Build the staging and mart layers:
   ```bash
   docker exec -i transit-postgres psql -U <user> -d transit < sql/03_create_staging_table.sql
   docker exec -i transit-postgres psql -U <user> -d transit < sql/04_load_staging.sql
   docker exec -i transit-postgres psql -U <user> -d transit < sql/06_create_mart_tables.sql
   docker exec -i transit-postgres psql -U <user> -d transit < sql/07_load_mart.sql
   ```
7. Start the API (runs on http://localhost:3000):
   ```bash
   node src/server.js
   ```
8. In a new terminal, start the dashboard (runs on http://localhost:5173):
   ```bash
   cd dashboard
   npm install
   npm run dev
   ```

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/daily` | Total passages per day |
| `GET /api/hourly?date=2024-06-03&line=MARMARAY` | Passages per hour for a given date and line |
| `GET /api/lines` | Top 20 lines by total passages |

## Data Source

- Provider: Istanbul Metropolitan Municipality (IBB) Open Data Portal
- Dataset: Hourly Public Transport Data Set
- Format: Monthly CSV files
- License: Istanbul Metropolitan Municipality Open Data License
- Link: [data.ibb.gov.tr](https://data.ibb.gov.tr)
- Coverage: January 2020 – December 2024

## Status

The core pipeline (raw → staging → mart → API → dashboard) is working with June 2024 data and runs with Docker Compose. Next step: automating monthly loads.