const mysql = require('mysql2'); //Imports mysql2 library so we can interact with the mySQL databases;
const inquirer = require('inquirer'); //Imports inquirer library so we can use CLI
const cTable = require('console.table');//Use console.table similiar to console.log. Makes it beautiful!
// const dbUtil = require('./util/dbquery.js'); //Imports database query functions

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
async function main() {
    // create the connection
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root', //MySQL username
        password: 'WhirlwindEngine9893!?', //MySQL password
        database: 'company_db' //MySQL database name
    });
    // query database
    const [rows, fields] = await connection.startmenu();
  };
/*      Bonus
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
]).then(answer => {
    switch(answer.selection) {
        case 'View All Employees':
          // code block
          break;
        case 'Add Employee':
          // code block
          break;
          case 'Update Employee Role':
          // code block
          break;
        case 'View All Roles':
          // code block
          break;
          case 'Add Role':
          // code block
          break;
        case 'Add Employee':
          // code block
          break;
          case 'View All Departments':
          // code block
          break;
        case 'Add Department':
          // code block
          break;
        default:
          // code block
      }
})
.catch((err) => {
    console.log(`There has been an error`, err)
})
};