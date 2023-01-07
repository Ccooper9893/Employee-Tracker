const mysql = require('mysql2'); //Imports mysql2 library so we can interact with the mySQL databases;
const inquirer = require('inquirer'); //Imports inquirer library so we can use CLI
const cTable = require('console.table');// Use console.table similiar to console.log. Makes it beautiful!

//Connects to mySQL database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root', //MySQL username
        password: 'WhirlwindEngine9893!?', //MySQL password
        database: 'company_db' //MySQL database name
    },
    console.log('You have connected to the company_db database.')
);

