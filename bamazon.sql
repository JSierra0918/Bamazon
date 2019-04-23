DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER auto_increment NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    department_name VARCHAR(200) NOT NULL,
    price DECIMAL(5,2) NOT NULL,
    stock_quantity INTEGER(0) NOT NULL,
    primary key (item_id)
); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("water bottle", "Groceries", 1.00, 100), ("Soda", "Groceries", 2.00, 100),("Dog Toy", "Pets", 3.500, 20);