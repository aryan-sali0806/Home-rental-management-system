CREATE DATABASE IF NOT EXISTS rental_db;
USE rental_db;

CREATE TABLE IF NOT EXISTS Admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Owner (
    owner_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    address TEXT
);

CREATE TABLE IF NOT EXISTS Tenant (
    tenant_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    id_proof VARCHAR(100),
    occupation VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Property (
    property_id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    title VARCHAR(150),
    location VARCHAR(150),
    rent_amount DECIMAL(10,2),
    status VARCHAR(50),
    description TEXT,
    FOREIGN KEY (owner_id) REFERENCES Owner(owner_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Lease (
    lease_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    property_id INT NOT NULL,
    start_date DATE,
    end_date DATE,
    deposit_amount DECIMAL(10,2),
    lease_status VARCHAR(50),
    FOREIGN KEY (tenant_id) REFERENCES Tenant(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES Property(property_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Payment (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    lease_id INT NOT NULL,
    amount DECIMAL(10,2),
    payment_date DATE,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    FOREIGN KEY (lease_id) REFERENCES Lease(lease_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS MaintenanceRequest (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    property_id INT NOT NULL,
    description TEXT,
    request_date DATE,
    status VARCHAR(50),
    FOREIGN KEY (tenant_id) REFERENCES Tenant(tenant_id),
    FOREIGN KEY (property_id) REFERENCES Property(property_id)
);

INSERT IGNORE INTO Admin (name, email, password) VALUES
('System Admin', 'admin@rental.com', '$2b$10$examplehashedpassword1'),
('Property Mgr', 'manager@rental.com', '$2b$10$examplehashedpassword2');

INSERT IGNORE INTO Owner (name, email, phone, address) VALUES
('Raj Sharma', 'raj@gmail.com', '9876543210', 'Pune, Maharashtra'),
('Anjali Mehta', 'anjali@gmail.com', '9123456780', 'Mumbai, Maharashtra'),
('Vikram Singh', 'vikram@gmail.com', '9988776655', 'Bangalore, Karnataka');

INSERT IGNORE INTO Tenant (name, email, phone, id_proof, occupation) VALUES
('Aryan Gupta', 'aryan@gmail.com', '9001122334', 'Aadhaar', 'Student'),
('Sneha Patil', 'sneha@gmail.com', '9887766554', 'Passport', 'Software Engineer'),
('Rohit Verma', 'rohit@gmail.com', '9776655443', 'PAN Card', 'Manager');

INSERT IGNORE INTO Property (owner_id, title, location, rent_amount, status, description) VALUES
(1, '2BHK Apartment', 'Pune', 18000.00, 'Rented', 'Near metro station'),
(1, '1BHK Flat', 'Pune', 12000.00, 'Available', 'Fully furnished'),
(2, '3BHK Villa', 'Mumbai', 45000.00, 'Rented', 'Sea facing property'),
(3, 'Studio Apartment', 'Bangalore', 15000.00, 'Available', 'Close to IT park');

INSERT IGNORE INTO Lease (tenant_id, property_id, start_date, end_date, deposit_amount, lease_status) VALUES
(1, 1, '2025-01-01', '2025-12-31', 36000.00, 'Active'),
(2, 3, '2024-06-01', '2025-05-31', 90000.00, 'Active'),
(3, 1, '2023-01-01', '2023-12-31', 36000.00, 'Completed');

INSERT IGNORE INTO Payment (lease_id, amount, payment_date, payment_method, payment_status) VALUES
(1, 18000.00, '2025-01-05', 'UPI', 'Paid'),
(1, 18000.00, '2025-02-05', 'UPI', 'Paid'),
(2, 45000.00, '2025-01-03', 'Bank Transfer', 'Paid'),
(2, 45000.00, '2025-02-03', 'Bank Transfer', 'Pending');

INSERT IGNORE INTO MaintenanceRequest (tenant_id, property_id, description, request_date, status) VALUES
(1, 1, 'Water leakage in sink', '2025-01-10', 'In Progress'),
(2, 3, 'AC not working', '2025-02-02', 'Open'),
(1, 1, 'Paint peeling', '2025-02-15', 'Resolved');