CREATE TABLE IF NOT EXISTS dim_product (
    product_id SERIAL PRIMARY KEY,
    product_kind TEXT
);

CREATE TABLE IF NOT EXISTS dim_line (
    line_id SERIAL PRIMARY KEY,
    line_name TEXT,
    road_type TEXT
);

CREATE TABLE IF NOT EXISTS dim_date (
    date_id SERIAL PRIMARY KEY,
    full_date DATE,
    day_name TEXT,
    is_weekend BOOLEAN
);

CREATE TABLE IF NOT EXISTS fact_hourly_ridership (
    date_id INTEGER REFERENCES dim_date(date_id),
    transition_hour SMALLINT,
    line_id INTEGER REFERENCES dim_line(line_id),
    product_id INTEGER REFERENCES dim_product(product_id),
    number_of_passage INTEGER,
    number_of_passenger INTEGER
);
