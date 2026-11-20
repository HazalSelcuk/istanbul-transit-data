TRUNCATE TABLE fact_hourly_ridership, dim_date, dim_line, dim_product RESTART IDENTITY;

INSERT INTO dim_product (product_kind)
SELECT DISTINCT COALESCE(product_kind, 'UNKNOWN')
FROM staging_hourly_transport;

INSERT INTO dim_line (line_name, road_type)
SELECT DISTINCT line_name, road_type
FROM staging_hourly_transport;

INSERT INTO dim_date (full_date, day_name, is_weekend)
SELECT DISTINCT
    transition_date,
    TO_CHAR(transition_date, 'FMDay'),
    EXTRACT(ISODOW FROM transition_date) IN (6, 7)
FROM staging_hourly_transport;

INSERT INTO fact_hourly_ridership
    (date_id, transition_hour, line_id, product_id, number_of_passage, number_of_passenger)
SELECT
    d.date_id,
    s.transition_hour,
    l.line_id,
    p.product_id,
    SUM(s.number_of_passage),
    SUM(s.number_of_passenger)
FROM staging_hourly_transport s
JOIN dim_date d ON d.full_date = s.transition_date
JOIN dim_line l ON l.line_name = s.line_name AND l.road_type = s.road_type
JOIN dim_product p ON p.product_kind = COALESCE(s.product_kind, 'UNKNOWN')
GROUP BY d.date_id, s.transition_hour, l.line_id, p.product_id;