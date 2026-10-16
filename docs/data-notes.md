# Data Notes

This document records observations from the IBB Hourly Public Transport Data Set before building the pipeline.

## Coverage

- Available months: January 2020 – December 2024 (60 months)
- Missing months: none
- The dataset has not been updated since early 2025.
- Files are sorted by date and hour: the first rows of a month belong to the first day, hour 00.
- Rows per day in the partial file (`cut -d, -f1 | sort | uniq -c`): weekdays (June 3–7) have about 620,000–640,000 rows, Saturdays about 550,000 and Sunday (June 2) about 455,000. June 9 is incomplete (data ends at 15:00).

## Columns

Observations below are based on the portal preview of June 2024, which shows only the first 99 rows. They will be verified with SQL after loading the data.

- `transition_date`: all preview rows are 2024-06-01.
- `transition_hour`: all preview rows are 00.
- `transport_type_id` / `road_type`: 1 = highway, 2 = rail, 3 = sea. Matches the data dictionary.
- `line_name`: short line codes such as M1, T4.
- `line`: route description, e.g. Yenikapı – Avcılar.
- `town`: mostly filled, a few rows are empty.
- `station_poi_desc_cd`: some rows are empty. Not used in the pipeline.
- `product_kind`: values seen are TAM, INDIRIMLI1, INDIRIMLI2, UCRETSIZ (uppercase, without Turkish characters).

## Issues Found

- December 2024: the download file is named `hourly_transportation_202512.csv` (December 2025), but the page title says December 2024. The file was created on 4 January 2025, so the file name is most likely a typo. To be confirmed by checking `transition_date` values in the file.
- December 2024: the data preview shows 0 records.
- `line` and `line_name` are swapped compared to the data dictionary. The dictionary says `line` is the line code and `line_name` is the line name, but the data shows the opposite.
- `town`: 4 of 99 sample rows are empty (checked with SQL). According to the validation rules, these rows will be kept and the district will be set to UNKNOWN.
- June 2024: the portal preview and the API sample both have an `_id` column, but the data dictionary does not list it. It is most likely a row number added by the portal. Confirmed: the full file does not have an `_id` column. It starts with `transition_date` and has 13 columns.
- June 2024: 5000 rows were requested from the API, but only 99 rows were returned. The portal preview also shows 99 rows, so the API seems to hold only a small sample for this month. The API will be used only for testing; the full CSV file will be downloaded for real loading.
- June 2024 API sample: the header line ends with CRLF, but data lines end with LF. PostgreSQL COPY fails with "unquoted newline found in data". Fixed by removing `\r` characters before loading.
- `road_type`: values are OTOYOL, RAYLI and DENZ. "DENZ" is probably a typo or abbreviation of "DENIZ" (sea). To be standardized in the staging layer.
- `product_kind`: 1 of 99 sample rows is NULL. This confirms the rule to keep such rows and set the card type to UNKNOWN.
- June 2024 full file: the server reports the file size as 1575 MB, which matches the 1.5 GiB shown on the portal.
- Full file download: the IBB server closes the connection after about 2 minutes (around 340-385 MB). It does not support resuming a download (`curl: (33) HTTP server doesn't seem to support byte ranges`), so a monthly file cannot be downloaded in one piece with the current connection. A partial file covering June 1–9, 2024 will be used for development. The last line of the partial file is likely incomplete.
- After several attempts, the server started returning `502 Bad Gateway` (nginx) instead of the file, which suggests the problem is on the server side.
- June 2024 partial file (`hourly_transportation_202406_partial.csv`): 4,955,362 lines, about 29% of the full file. It covers 2024-06-01 00:00 to 2024-06-09 15:00. The last line is cut in the middle and must be removed before loading.
- The full file has no CRLF problem (`\r` count is 0). The CRLF issue seen earlier comes only from the API sample.