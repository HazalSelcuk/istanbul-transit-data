TRUNCATE TABLE staging_hourly_transport;

INSERT INTO staging_hourly_transport
SELECT
    transition_date::DATE,
    transition_hour::SMALLINT,
    transport_type_id::SMALLINT,
    road_type,
    line,
    transfer_type,
    number_of_passage::INTEGER,
    number_of_passenger::INTEGER,
    NULLIF(product_kind, ''),
    transaction_type_desc,
    NULLIF(town, ''),
    line_name
FROM raw_hourly_transport;