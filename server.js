const mysql = require('mysql2'); //Imports mysql2 library so we can interact with the mySQL databases;
const inquirer = require('inquirer'); //Imports inquirer library so we can use CLI
const cTable = require('console.table');//Use console.table similiar to console.log. Makes it beautiful!
const dbUtil = require('./util/dbquery.js'); //Imports database query functions

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

/* Question List
    - View All Employees
    - Add Employee
    - Update Employee Role
    - View All Roles
    - Add Role
    - View All Departments
    - Add Department
*Bonus*
    - Update Employee Managers
    - View Employees By Manager
    - View Employees By Department
    - Delete Departments, Roles, and Employees
    - View Total Utilized Budget of a Department (Combined salaries of all employees in specific department)
*/
function startMenu() {
inquirer.prompt([
    {
        type: 'list',
        name: 'selection',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
        
    }
]).then(answers => {

})
};

startMenu();