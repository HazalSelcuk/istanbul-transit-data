-- Exploratory queries on the June 2024 API sample (99 rows)

-- 1. How many distinct districts are there?
SELECT COUNT(DISTINCT town)
FROM raw_hourly_transport;

-- 2. How many rows have an empty district?
SELECT COUNT(*)
FROM raw_hourly_transport
WHERE town IS NULL OR town = '';

-- 3. What is the total number of trips by transport type?
SELECT road_type, SUM(number_of_passage::integer) AS total_trips
FROM raw_hourly_transport
GROUP BY road_type;

-- 4. Which 5 lines have the most trips?
SELECT line_name, SUM(number_of_passage::integer) AS total_trips
FROM raw_hourly_transport
GROUP BY line_name
ORDER BY total_trips DESC
LIMIT 5;

-- 5. Which card types exist and how many rows does each have?
SELECT product_kind, COUNT(*) AS row_count
FROM raw_hourly_transport
GROUP BY product_kind
ORDER BY row_count DESC;

