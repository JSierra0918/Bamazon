var inquirer = require("inquirer");
var mysql = require("mysql");
// var bamazonCustomer = require("./bamazonCustomer");
var fghj = []
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
    bamazonManager();
});

function bamazonManager() {
    //ask the manager what's their choice
    inquirer.prompt([{
        type: "list",
        name: "managerOption",
        message: "Menu options:",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }]).then((response) => {

        switch (response.managerOption) {
            case "View Products for Sale":
                {
                    readProducts();
                }
                break;
            case "View Low Inventory":
                {
                    //view low inventory
                    viewLowInventory();
                }
                break;
            case "Add to Inventory":
                {
                    //add to inventory
                    addToInventory();
                }
                break;
            case "Add New Product":
                {
                    //add new product
                    addNewProduct();
                }
                break;
            case "Exit":
                {
                    connection.end();
                }
        }

    });
}

///ALL FUNCTIONS
function readProducts() {
    console.log("My Bamazon Products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECTd statement
        displayProducts(res);
        //re-initialize user choice.
        bamazonManager();
    });

}

function viewLowInventory() {
    console.log("Low Inventory Products \n");
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        displayProducts(res);
        bamazonManager();
    });
}

function addToInventory() {

    console.log("Select product by ID number...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //display all products
        displayProducts(res);
        restock();
    });
}

function restock() {
    inquirer.prompt([{
        message: "Choose product by ID number",
        name: "userIDChoice"
    }]).then((response) => {
        // console.log(response);
        restockItem(response.userIDChoice);
    });
}

function restockItem(choice) {
    connection.query("SELECT * FROM products WHERE ?", [{
        item_id: choice
    }], function (err, res) {
        if (err) throw err;

        // Log all results of the SELECT statement
        console.log(`--------------------------------------------------------------------------------`);
        console.log(`ID: ${res[0].item_id} \nProduct: ${res[0].product_name}\nName: ${res[0].department_name}\nPrice: ${res[0].price}\nItems in Stock: ${res[0].stock_quantity}`);
        console.log(`--------------------------------------------------------------------------------`);
        restockAmount(res[0]);
    });
}

function restockAmount(product) {
    inquirer.prompt([{
        message: "How much would you like to restock it by?",
        name: "restockAmount"
    }]).then((response) => {
        connection.query(`UPDATE products SET stock_quantity = stock_quantity+${response.restockAmount} where item_id = ${product.item_id};`, function (err, res) {
            if (err) throw err;
            var updateItem = parseFloat(response.restockAmount) + product.stock_quantity;
            console.log(`You restocked ${product.product_name}.  Now you have a total of ${updateItem}.`);
            // go back to main menu
            bamazonManager();
        });
    });
}

function addNewProduct() {
    console.log("New product: ");
    inquirer.prompt([{
            message: "Add name of product",
            name: "Name"
        }, {
            message: "Add department name",
            name: "Department"
        },
        {
            message: "Add price",
            name: "Price"
        },
        {
            message: "Quantity of products",
            name: "Quantity"
        }
    ]).then((product) => {
       connection.query("INSERT INTO products SET ?", [{
            product_name: product.Name,
            department_name: product.Department,
            price: product.Price,
            stock_quantity: product.Quantity
        }], (err, res) => {
            if (err) throw err;
            console.log(`------------------------------------------------------------------------------------------`);
            console.log("Product added to the inventory");
            console.log(`Product Name: ${product.Name}\nProduct Department: ${product.Department}\nProduct Price: ${product.Price}\nProduct Stock: ${product.Quantity}`);
            // displayProducts();
            console.log(`------------------------------------------------------------------------------------------`);
            bamazonManager();
        })
    
    });
}

function displayProducts(res) {
    res.forEach(item => {
        //   console.log(item);
        console.log(`ID: ${item.item_id} | Product: ${item.product_name} | Department: ${item.department_name}| Price: ${item.price} | Number in Stock: ${item.stock_quantity} `);
        console.log(`---------------------------------------\n`);
    });
}