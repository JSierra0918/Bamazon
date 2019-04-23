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

function purchaseAmount(stock) {
    inquirer.prompt([{
        message: "How much would you like to buy?",
        name: "purchaseAmount"
    }]).then((response) => {
        //check if we have enough stock
        if (response.purchaseAmount > stock.stock_quantity) {
            console.log("We don't have that amount! We only have " + stock.stock_quantity);
            purchaseAmount(stock);
        } else {
            var stockLeft = stock.stock_quantity - response.purchaseAmount;
            updateProduct(stockLeft, stock.item_id);
            //take in the users amount and update the SQL database
        }
    });
}

function updateProduct(stockLeft,stockID) {
    console.log("Updating all Rocky Road quantities...\n");
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
            console.log(res.affectedRows + " products updated!\n");
            // Call deleteProduct AFTER the UPDATE completes
            // deleteProduct();
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}