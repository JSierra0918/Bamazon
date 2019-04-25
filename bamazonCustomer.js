var inquirer = require("inquirer");
var mysql = require("mysql");
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
        res.forEach(item => {
            //   console.log(item);
            console.log(`ID: ${item.item_id} | Product: ${item.product_name} | Department: ${item.department_name}| Price: ${item.price} | Number in Stock: ${item.stock_quantity} `);
            console.log(`---------------------------------------\n`);
        });
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
        console.log(`ID: ${res[0].item_id} \nProduct: ${res[0].product_name}\nName: ${res[0].department_name}\nPrice: ${res[0].price}\nItems in Stock: ${res[0].stock_quantity}`);
        // Log all results of the SELECT statement

        purchaseAmount(res[0]);
    });
}

function purchaseAmount(company) {
    inquirer.prompt([{
        message: "How much would you like to buy?",
        name: "purchaseAmount"
    }]).then((response) => {
        //check if we have enough company stock
        if (response.purchaseAmount > company.stock_quantity) {
            console.log("We only have " + company.stock_quantity + " in stock.");
            purchaseAmount(company);
        } else {
            var stockLeft = company.stock_quantity - response.purchaseAmount;
            var cost = company.price * response.purchaseAmount;
            console.log(`You spent ${cost}!`);
            updateProduct(stockLeft, company.item_id);

            //check if they want to buy another product
            inquirer.prompt([{
                type: "list",
                name: "continue",
                message: "Would you like to buy another product?",
                choices: ["Buy","Exit"]
            }]).then((response) => {
                switch (response.continue){
                    case ("Buy"): {
                        readProducts();
                    }break;
                    case ("Exit"): {
                        connection.end();
                    }
                }
            });
            //take in the users amount and update the SQL database
        }
    });
}

function updateProduct(stockLeft,stockID) {
    var query = connection.query(
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

    // logs the actual query being run
    // console.log(query.sql);
}

module.exports = {
    readProducts: readProducts
}