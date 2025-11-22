-- Sample data for testing (Optional)
-- Insert a test user
INSERT INTO users (name, email, password_hash, dob, age_group, height_cm, weight_kg, blood_group)
VALUES ('Sarah Johnson', 'sarah@example.com', '$2b$10$examplehashedpassword', '1995-03-15', 'adult', 165.5, 62.0, 'O+');

-- Insert sample cycles for the test user
INSERT INTO cycle_records (user_id, start_date, end_date, flow_level, pain_level, cycle_length, notes)
VALUES 
  (1, '2024-10-01', '2024-10-06', 'medium', 5, 5, 'Normal flow'),
  (1, '2024-10-29', '2024-11-02', 'medium', 4, 4, 'Slightly lighter than usual'),
  (1, '2024-11-26', '2024-12-01', 'heavy', 6, 5, 'Heavier flow'),
  (1, '2024-12-24', NULL, 'medium', 3, NULL, 'Currently in cycle');

-- Insert sample symptoms for the cycles
INSERT INTO symptoms (cycle_id, log_date, mood, cramps, headache, bloating, nausea, discharge, notes)
VALUES 
  (1, '2024-10-02', 'irritable', true, true, true, false, 'normal', 'Felt emotional'),
  (1, '2024-10-03', 'neutral', true, false, true, false, 'normal', 'Pain subsiding'),
  (2, '2024-10-30', 'happy', false, false, true, false, 'normal', 'Good energy'),
  (3, '2024-11-27', 'tired', true, true, true, true, 'heavy', 'Rough day'),
  (3, '2024-11-28', 'irritable', true, false, true, false, 'normal', 'Still tired');
