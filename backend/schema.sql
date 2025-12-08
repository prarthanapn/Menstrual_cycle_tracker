-- Database schema for Menstrual Health Tracker
-- MySQL 8.0 compatible

CREATE DATABASE IF NOT EXISTS menstrual_tracker;
USE menstrual_tracker;

-- Users table: stores user profiles
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  dob DATE,
  age_group ENUM('teen', 'adult'),
  height_cm FLOAT,
  weight_kg FLOAT,
  blood_group ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cycle records: stores menstrual cycle data
CREATE TABLE cycle_records (
  cycle_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  start_date DATE,
  end_date DATE,
  is_end_date TINYINT(1) DEFAULT 0,
  flow_level ENUM('light', 'medium', 'heavy'),
  pain_level TINYINT,
  discharge ENUM('light', 'moderate', 'heavy'),
  cycle_length INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX (user_id, start_date)
);

-- Symptoms table: stores daily symptom logs
CREATE TABLE symptoms (
  symptom_id INT AUTO_INCREMENT PRIMARY KEY,
  cycle_id INT,
  log_date DATE,
  mood ENUM('happy', 'neutral', 'sad', 'irritable', 'tired'),
  cramps BOOLEAN,
  headache BOOLEAN,
  bloating BOOLEAN,
  nausea BOOLEAN,
  discharge VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cycle_id) REFERENCES cycle_records(cycle_id) ON DELETE CASCADE,
  INDEX (cycle_id, log_date)
);

-- Reports table: stores generated PDF reports
CREATE TABLE reports (
  report_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  report_title VARCHAR(255),
  generated_on DATETIME,
  file_path VARCHAR(255),
  doctor_email VARCHAR(255),
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX (user_id, generated_on)
);

-- Chatbot logs table: stores chat interactions
CREATE TABLE chatbot_logs (
  chat_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  user_message TEXT,
  bot_response TEXT,
  triage_level ENUM('normal', 'see_doctor', 'urgent'),
  chat_time DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX (user_id, chat_time)
);
