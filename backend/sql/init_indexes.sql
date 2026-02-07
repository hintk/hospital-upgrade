-- Database Index Initialization Script
-- Usage: Execute this script to optimize query performance

-- 1. Index for Patient History Query:
-- Query: SELECT * FROM appointment WHERE patient_id = ? ORDER BY appointment_time DESC;
DROP INDEX IF EXISTS idx_appointment_patient_id_time ON appointment;
CREATE INDEX idx_appointment_patient_id_time ON appointment(patient_id, appointment_time DESC);

-- 2. Index for Doctor Schedule Query:
-- Query: SELECT * FROM schedule WHERE doctor_id = ? AND schedule_date >= ? ORDER BY start_time;
DROP INDEX IF EXISTS idx_schedule_doctor_id_date ON schedule;
CREATE INDEX idx_schedule_doctor_id_date ON schedule(doctor_id, schedule_date, start_time);

-- 3. Index for Doctor Department Query:
-- Query: Common filter by department
DROP INDEX IF EXISTS idx_doctor_department_id ON doctor;
CREATE INDEX idx_doctor_department_id ON doctor(department_id);

-- 4. Index for Appointment Status Statistics:
-- Query: Statistics or filtering by status and time
DROP INDEX IF EXISTS idx_appointment_status_date ON appointment;
CREATE INDEX idx_appointment_status_date ON appointment(status, appointment_time);

-- Verification: Show all indexes
SHOW INDEXES FROM appointment;
SHOW INDEXES FROM schedule;
SHOW INDEXES FROM doctor;
