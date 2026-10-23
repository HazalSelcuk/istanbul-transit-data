-- 1. Rows with an hour outside 0-23
SELECT COUNT (*)
FROM staging_hourly_transport
WHERE transition_hour < 0 OR transition_hour > 23;


-- 2. Rows with a negative trip or passenger count
SELECT COUNT (*)
FROM staging_hourly_transport
WHERE number_of_passage < 0 OR number_of_passenger < 0; 


-- 3. Rows with more passengers than trips
SELECT COUNT (*)
FROM staging_hourly_transport
WHERE number_of_passenger > number_of_passage;


-- 4. Rows with an empty district
SELECT COUNT (*)
FROM staging_hourly_transport 
WHERE town IS NULL;


-- 5. Date range of the data
SELECT MIN(transition_date), MAX(transition_date)
FROM staging_hourly_transport; 


