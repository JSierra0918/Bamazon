var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

// var bamazonCustomer = require("./bamazonCustomer");
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "2kR@20Ht",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    bamazonSupervisor();
});

function bamazonSupervisor() {
    //ask the manager what's their choice
    inquirer.prompt([{
        type: "list",
        name: "managerOption",
        message: "Menu options:",
        choices: ["View Product Sales by Department", "Create Department", "Exit"]
    }]).then((response) => {

        switch (response.managerOption) {
            case "View Product Sales by Department":
                {
                    readDepartments();
                }
                break;
            case "Create Department":
                {
                    //view low inventory
                    // viewLowInventory();
                }
                break;

            case "Exit":
                {
                    connection.end();
                }
        }

    });
}

function readDepartments() {
    console.log("My Bamazon Products...\n");
    connection.query("SELECT department_id,department_name, department_name FROM departments", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        displayProducts(res);
        // buyStuff();
        // connection.end();
    });
}


function displayProducts(res) {
    var table = new Table({
        head: ["Item ID", "Product Name", "Price", "Department", "Item's in Stock", " Product Sales"],
        colWidths: [10, 20, 20, 20, 20, 20]
    });

    res.forEach(item => {
        //   console.log(item);
        // console.log(`ID: ${item.item_id} | Product: ${item.product_name} | Department: ${item.department_name}| Price: ${item.price} | Number in Stock: ${item.stock_quantity} `);
        // console.log(`---------------------------------------\n`);

        table.push([item.item_id, item.product_name, item.department_name, item.price, item.stock_quantity, item.product_sales])
    });

    console.log(table.toString());
}