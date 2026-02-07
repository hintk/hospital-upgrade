# Database Optimization Strategy

This document outlines the indexing strategy implemented to optimize critical database queries in the Pegasus Hospital system.

## 1. Patient Appointment History

*   **Query**: Fetching a patient's appointment history, sorted by time.
    ```sql
    SELECT * FROM appointment 
    WHERE patient_id = ? 
    ORDER BY appointment_time DESC;
    ```
*   **Index**: `idx_appointment_patient_id_time`
    *   **Columns**: `(patient_id, appointment_time DESC)`
    *   **Type**: Compound Index
*   **Optimization Effect**:
    *   **Before**: Full Table Scan (or simple index on `patient_id` with Filesort).
    *   **After**: Range Scan on index. No external sort required ("Using index condition").

## 2. Doctor Schedule Lookup

*   **Query**: Checking a doctor's schedule for future dates.
    ```sql
    SELECT * FROM schedule 
    WHERE doctor_id = ? 
    AND schedule_date >= NOW() 
    ORDER BY start_time;
    ```
*   **Index**: `idx_schedule_doctor_id_date`
    *   **Columns**: `(doctor_id, schedule_date, start_time)`
    *   **Type**: Compound Index
*   **Optimization Effect**:
    *   **Before**: Possible index on `doctor_id`, but `schedule_date` filtering and `start_time` sorting would require scanning rows and sorting in memory.
    *   **After**: Efficient range scan on `schedule_date` for a specific doctor. Sorting by `start_time` might still happen if the range scan covers many rows, but including `start_time` covers the order if the date is an equality check (e.g. for a specific day). For range queries on date, it still helps filter significantly.

## 3. Doctor Department Filtering

*   **Query**: Listing doctors in a specific department.
    ```sql
    SELECT * FROM doctor WHERE department_id = ?;
    ```
*   **Index**: `idx_doctor_department_id`
    *   **Columns**: `(department_id)`
    *   **Type**: Simple Index
*   **Optimization Effect**:
    *   **Before**: Full Table Scan.
    *   **After**: Ref access using index.

## 4. Appointment Status Statistics

*   **Query**: Analyzing appointments by status over time.
    ```sql
    SELECT COUNT(*) FROM appointment 
    WHERE status = ? AND appointment_time BETWEEN ? AND ?;
    ```
*   **Index**: `idx_appointment_status_date`
    *   **Columns**: `(status, appointment_time)`
    *   **Type**: Compound Index
*   **Optimization Effect**:
    *   Directly filters by status and range scans time.

## Verification

To verify the optimization, you can run:

```sql
EXPLAIN SELECT * FROM appointment WHERE patient_id = '1000000001' ORDER BY appointment_time DESC;
```

Expected `key`: `idx_appointment_patient_id_time`
Expected `Extra`: `Using index condition` (and NOT `Using filesort`).
