var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

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
    bamazon();
});

function bamazon() {
    //display products
    readProducts();

}

//FUNCTIONS
function readProducts() {
    console.log("My Bamazon Products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        displayProducts(res);
        buyStuff();
        // connection.end();
    });
}

function buyStuff() {
    inquirer.prompt([{
        message: "Choose product by ID number",
        name: "userIDChoice"
    }]).then((response) => {
        // console.log(response);
        displayIDChoice(response.userIDChoice);
    });
}

function displayIDChoice(choice) {
    connection.query("SELECT * FROM products WHERE ?", [{
        item_id: choice
    }], function (err, res) {
        if (err) throw err;
        displayProducts(res);
        // Log all results of the SELECT statement
        purchaseAmount(res[0]);
    });
}

function purchaseAmount(company) {
    inquirer.prompt([{
        message: "How much would you like to buy?",
        name: "purchaseAmount",
        validate: (value) => {
            if (isNaN(value) === false) {
                return true;
            }

            return false;
        }
    }]).then((response) => {
        //check if we have enough company stock
        if (response.purchaseAmount > company.stock_quantity) {
            console.log("We only have " + company.stock_quantity + " in stock.");
            purchaseAmount(company);
        } else {
            var stockLeft = company.stock_quantity - response.purchaseAmount;
            var cost = company.price * parseInt(response.purchaseAmount);

            console.log(`You spent ${cost} dollars!`);
            updateProduct(stockLeft, company.item_id, cost);

            //check if they want to buy another product
            inquirer.prompt([{
                type: "list",
                name: "continue",
                message: "Would you like to buy another product?",
                choices: ["Buy", "Exit"]
            }]).then((response) => {
                switch (response.continue) {
                    case ("Buy"):
                        {
                            readProducts();
                        }
                        break;
                    case ("Exit"):
                        {
                            connection.end();
                        }
                }
            });
            //take in the users amount and update the SQL database
        }
    });
}

function updateProduct(stockLeft, stockID, productSale) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
                stock_quantity: stockLeft
            },
            {
                item_id: stockID
            }
        ],
        function (err, res) {

        }
    );

    connection.query(
        "INSERT INTO products SET ? WHERE ?",
        [{
                product_sales: productSale
            },
            {
                item_id: stockID
            }

        ],
        function (err, res) {

        }
    );
}

function displayProducts(res) {
    var table = new Table({
        head: ["Item ID", "Product Name", "Department", "Price", "Item's in Stock", "Purchase Amount" ],
        colWidths: [10, 20, 20, 20, 20, 20]
    });

    //Display each product
    res.forEach(item => {
        table.push([item.item_id, item.product_name, item.department_name, item.price, item.stock_quantity, item.product_sales])
    });

    console.log(table.toString());
}