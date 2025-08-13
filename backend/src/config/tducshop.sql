-- Tạo database
CREATE DATABASE IF NOT EXISTS tducshop;
USE tducshop;

-- Bảng Users
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    address VARCHAR(255),
    role ENUM('admin', 'user') DEFAULT 'user',
    password VARCHAR(255) NOT NULL
);

-- Bảng Products
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    price_old DECIMAL(10,2),
    screen_size VARCHAR(50),
    screen_tech VARCHAR(100),
    chipset VARCHAR(100),
    nfc BOOLEAN DEFAULT 0,
    RAM VARCHAR(50),
    ROM VARCHAR(50),
    battery VARCHAR(50),
    sim_slots VARCHAR(50),
    os VARCHAR(100),
    water_resistant BOOLEAN DEFAULT 0,
    stock INT DEFAULT 0,
    image_url VARCHAR(255)
);

-- Bảng Orders
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10,2) NOT NULL,
    payment_method ENUM('COD', 'Credit Card', 'Bank Transfer') DEFAULT 'COD',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    order_status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    shipping_address VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Bảng OrderDetails
CREATE TABLE OrderDetails (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Bảng Comments
CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    comment TEXT,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    censor BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Bảng Cart
CREATE TABLE Cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Thêm dữ liệu mẫu
INSERT INTO Users (name, email, phone_number, address, role, password) VALUES
('Admin', 'admin@example.com', '0123456789', 'Hà Nội', 'admin', '123456'),
('Nguyen Van A', 'a@example.com', '0987654321', 'TP.HCM', 'user', '123456');

INSERT INTO Products (category_id, name, price, price_old, screen_size, screen_tech, chipset, nfc, RAM, ROM, battery, sim_slots, os, water_resistant, stock, image_url) VALUES
(1, 'iPhone 15 Pro', 29990000, 31990000, '6.1"', 'Super Retina XDR', 'A17 Pro', 1, '8GB', '256GB', '3200mAh', '1 Nano SIM + eSIM', 'iOS 17', 1, 10, 'iphone15.jpg'),
(1, 'Samsung Galaxy S23', 24990000, 26990000, '6.1"', 'Dynamic AMOLED 2X', 'Snapdragon 8 Gen 2', 1, '8GB', '256GB', '3900mAh', '2 Nano SIM', 'Android 13', 1, 15, 's23.jpg');

INSERT INTO Orders (user_id, total_price, payment_method, payment_status, order_status, shipping_address) VALUES
(2, 29990000, 'COD', 'pending', 'pending', 'TP.HCM');

INSERT INTO OrderDetails (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 29990000);

INSERT INTO Comments (user_id, product_id, comment, censor) VALUES
(2, 1, 'Điện thoại xịn lắm!', 1);

INSERT INTO Cart (user_id, product_id, quantity) VALUES
(2, 2, 1);
