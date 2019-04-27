DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER auto_increment NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    department_name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(0) NOT NULL,
    product_sales DECIMAL(10,2) default 0,
    primary key (item_id)
); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE ("water bottle", "Groceries", 1.00, 100), ("Soda", "Groceries", 2.00, 100),("Dog Toy", "Pets", 3.500, 20),
("Air Pods", "Electronics", 160.00, 4);

-- update products set stock_quantity = stock_quantity+1 where item_id = 3;
select * from products;
-- SELECT * FROM products WHERE stock_quantity < 5;

CREATE TABLE departments (
	department_id INTEGER auto_increment NOT NULL,
    department_name VARCHAR(200) NOT NULL,
    over_head_costs  DECIMAL(10,2) NOT NULL,
    primary key (department_id)
); 

SELECT departments.department_id AS "department id", products.department_name AS "department name",
SUM(products.product_sales) AS "product sales", MIN(departments.over_head_costs) AS "over head cost", (SUM(products.product_sales) - MIN(departments.over_head_costs)) as "total profits"
FROM products
inner join departments on products.department_name = departments.department_name
GROUP BY  departments.department_id, products.department_name;

select * from departments;