const mysql = require('mysql2'); //Imports mysql2 library so we can interact with the mySQL databases;
const inquirer = require('inquirer');
const cTable = require('console.table');//Use console.table similiar to console.log. Makes it beautiful!

// Connect to the database
const db = mysql.createConnection(
      {
          host: 'localhost',
          user: 'root', //MySQL username
          password: 'WhirlwindEngine9893!?', //MySQL password
          database: 'company_db' //MySQL database name
      },
      console.log('You have connected to the company_db database.')
      // Add functions for inquirer questions
  );

  // Array of CMS options
  const selectionArr = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']

  inquirer.prompt([
    {
        type: 'list',
        name: 'command',
        message: 'What would you like to do?',
        choices: selectionArr
        
    }
  ]).then((results) => {
    switch(results.command) {
        case 'View All Employees':
          // code block
          db.query(`SELECT 
          e1.id, 
          e1.first_name, 
          e1.last_name,
          role.title,
          department.name AS department,
          role.salary,
          e2.first_name AS manager
      FROM employee AS e1
      LEFT JOIN role ON e1.role_id = role.id
      LEFT JOIN employee AS e2 ON e1.manager_id = e2.id
      LEFT JOIN department ON role.department_id = department.id;`, (err, result) => {
        if (err) {
          console.log(err)
        }
        console.table(result[0]);
        mainMenu();
      })
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
});
  /*      Bonus
    - Update Employee Managers
    - View Employees By Manager
    - View Employees By Department
    - Delete Departments, Roles, and Employees
    - View Total Utilized Budget of a Department (Combined salaries of all employees in specific department)
*/




