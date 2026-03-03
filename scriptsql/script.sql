CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    address VARCHAR(255),
    phone VARCHAR(50)
);
CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE
);
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    supplier_id INT NOT NULL,
    CONSTRAINT fk_products_supplier 
        FOREIGN KEY (supplier_id) 
        REFERENCES suppliers(id)
);
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_code VARCHAR(100) NOT NULL UNIQUE,
    order_date DATE NOT NULL,
    customer_id INT NOT NULL,
    CONSTRAINT fk_orders_customer 
        FOREIGN KEY (customer_id) 
        REFERENCES customers(id)
);
CREATE TABLE order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_details_order 
        FOREIGN KEY (order_id) 
        REFERENCES orders(id),
    CONSTRAINT fk_details_product 
        FOREIGN KEY (product_id) 
        REFERENCES products(id)
);

SELECT * FROM customers;
SELECT * FROM suppliers;
SELECT * FROM products;
SELECT * FROM orders;
SELECT * FROM order_details;

#consults:
# 1.
SELECT s.id AS supplier_id, s.name AS supplier_name,
SUM(od.quantity) AS total_items_sold,
SUM(od.quantity * od.unit_price) AS total_inventory_value
FROM suppliers s 
JOIN products p ON p.supplier_id = s.id
JOIN order_details od ON od.product_id = p.id
GROUP BY s.id, s.name
ORDER BY total_items_sold DESC;
#2: 
SELECT c.name AS customer_name,
o.transaction_code,
o.order_date,
p.name AS product_name,
od.quantity,
od.unit_price,
(od.quantity * od.unit_price) AS line_total
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN order_details od ON od.order_id = o.id 
JOIN products p ON p.id = od.product_id 
WHERE c.email = "andres.lopez@gmail.com" # search by email
ORDER BY o.order_date DESC;
#3:
SELECT p.category, p.name AS product_name, 
SUM(od.quantity) AS total_unit_sold,
SUM(od.quantity * od.unit_price) AS total_income
FROM products p
JOIN order_details od ON od.product_id = p.id
WHERE p.category = "Electronics" #put category u need
GROUP BY p.id, p.category, p.name
ORDER BY total_income DESC;
