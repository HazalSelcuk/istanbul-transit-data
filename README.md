# Istanbul Transit Data Platform

This project is a data pipeline that processes hourly public transport data published monthly by the Istanbul Metropolitan Municipality. It loads the data into a PostgreSQL database, cleans invalid and duplicate records, and models it for analysis. The results are displayed as charts on a web dashboard.

## Tech Stack

- Node.js: A program that reads CSV files and loads them into the database.
- PostgreSQL: The database where data is stored.
- SQL: Cleaning, modeling, and querying data.
- Express.js: The REST API from which the panel requests data.
- Vue.js: The web page where the charts are displayed.
- Docker / Docker Compose: Running the entire system with a single command.

## Data Source

- Provider: Istanbul Metropolitan Municipality (IBB) Open Data Portal
- Dataset: Hourly Public Transport Data Set
- Format: Monthly CSV files
- License: Istanbul Metropolitan Municipality Open Data License
- Link: [data.ibb.gov.tr](https://data.ibb.gov.tr/dataset/hourly-public-transport-data-set)

## Status

This project is currently in development. s