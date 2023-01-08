const mysql = require('mysql2'); //Imports mysql2 library so we can interact with the mySQL databases;
const inquirer = require('inquirer'); //Imports inquirer library so we can use CLI
const cTable = require('console.table');// Use console.table similiar to console.log. Makes it beautiful!
const queries = require('./utils/dbquery');// Imports mySQL database query texts

// Connect to the database
const db = mysql.createConnection(
      {
          host: 'localhost',
          user: 'root', //MySQL username
          password: 'WhirlwindEngine9893!?', //MySQL password
          database: 'company_db' //MySQL database name
      },
      console.log('\u001b[32m','\nYou have connected to the company_db database.\n')
      // Add functions for inquirer questions
  );

// Array of CMS options
const selectionArr = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']




/* Bonus
    - Update Employee Managers
    - View Employees By Manager
    - View Employees By Department
    - Delete Departments, Roles, and Employees
    - View Total Utilized Budget of a Department (Combined salaries of all employees in specific department)
*/