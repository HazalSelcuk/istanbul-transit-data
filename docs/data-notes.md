# Data Notes

This document records observations from the IBB Hourly Public Transport Data Set before building the pipeline.

## Coverage

- Available months: January 2020 – December 2024 (60 months)
- Missing months: none
- The dataset has not been updated since early 2025.
- Files are sorted by date and hour: the first rows of a month belong to the first day, hour 00.

## Columns

Observations below are based on the portal preview of June 2024, which shows only the first 99 rows. They will be verified with SQL after loading the data.

- `transition_date`: all preview rows are 2024-06-01.
- `transition_hour`: all preview rows are 00.
- `transport_type_id` / `road_type`: 1 = highway, 2 = rail, 3 = sea. Matches the data dictionary.
- `product_kind`: values seen are Tam, İndirimli 1, İndirimli 2, Ücretsiz, Personel.
- `line_name`: short line codes such as M1, T4.
- `line`: route description, e.g. Yenikapı – Avcılar.
- `town`: mostly filled, a few rows are empty.
- `station_poi_desc_cd`: some rows are empty. Not used in the pipeline.

## Issues Found

- December 2024: the download file is named `hourly_transportation_202512.csv` (December 2025), but the page title says December 2024. The file was created on 4 January 2025, so the file name is most likely a typo. To be confirmed by checking `transition_date` values in the file.
- December 2024: the data preview shows 0 records.
- `line` and `line_name` are swapped compared to the data dictionary. The dictionary says `line` is the line code and `line_name` is the line name, but the data shows the opposite.
- Some `town` values are empty. According to the validation rules, these rows will be kept and the district will be set to UNKNOWN.