-- Create the ResQFood database if it doesn't exist
CREATE DATABASE IF NOT EXISTS resqfood_db;
USE resqfood_db;

-- Table for all users (donors, volunteers, admins)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('donor', 'volunteer', 'admin') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for food donations
CREATE TABLE IF NOT EXISTS donations (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    food_type VARCHAR(100) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    pickup_address VARCHAR(255) NOT NULL,
    pickup_time_start DATETIME NOT NULL,
    pickup_time_end DATETIME NOT NULL,
    status ENUM('pending', 'assigned', 'picked_up', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES users(user_id)
);

-- Table to link volunteers to donations
CREATE TABLE IF NOT EXISTS assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT NOT NULL,
    volunteer_id INT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    pickup_timestamp DATETIME NULL,
    delivery_timestamp DATETIME NULL,
    FOREIGN KEY (donation_id) REFERENCES donations(donation_id),
    FOREIGN KEY (volunteer_id) REFERENCES users(user_id)
);

-- Table for beneficiaries receiving the food
CREATE TABLE IF NOT EXISTS beneficiaries (
    beneficiary_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20)
);