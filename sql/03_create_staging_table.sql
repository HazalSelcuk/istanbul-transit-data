CREATE TABLE IF NOT EXISTS staging_hourly_transport (
    transition_date DATE,
    transition_hour SMALLINT,
    transport_type_id SMALLINT,
    road_type TEXT,
    line TEXT,
    transfer_type TEXT,
    number_of_passage INTEGER,
    number_of_passenger INTEGER,
    product_kind TEXT,
    transaction_type_desc TEXT,
    town TEXT,
    line_name TEXT
);