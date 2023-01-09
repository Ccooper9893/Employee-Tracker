const mysql = require('mysql2'); //Imports mysql2 library so we can interact with the mySQL databases;
const inquirer = require('inquirer'); //Imports inquirer library so we can use CLI
const cTable = require('console.table');// Use console.table similiar to console.log. Makes it beautiful!

//Importing classes for role, department, and employee
const Department = require('./lib/department');
const Employee = require('./lib/employee');
const Role = require('./lib/role');

//Creating empty arrays to store row objects to display in inquirer prompts
let departments = [];
let employees = [];
let roles = [];

//Connect to the MySQL database
const db = mysql.createConnection(
      {
          host: 'localhost',
          user: 'root', //MySQL username
          password: 'WhirlwindEngine9893!?', //MySQL password
          database: 'company_db' //MySQL database name
      },
      console.log('You have connected to the company_db database.')
  );

// Query company database to save tables with information to an related arrays
db.promise().query('SELECT * FROM employee;')
      .then(([rows, fields]) => {
        for (emp of rows) {
            let newEmp = new Employee(emp.id, emp.first_name, emp.last_name, emp.role_id, emp.manager_id)
            employees.push(newEmp);
        }
      })
      .catch((err) => {console.log('There has been an query error', err)});

db.promise().query('SELECT * FROM role;')
    .then(([rows, fields]) => {
        for (role of rows) {
            let newRole = new Role(role.title, role.salary, role.department_id)
            roles.push(newRole)
        }
    })
    .catch((err) => {console.log('There has been an query error', err)});    

db.promise().query('SELECT * FROM department;')
    .then(([rows, fields]) => {
        for (dep of rows) {
            let newDep = new Department(dep.id, dep.name)
            departments.push(newDep)
        }
    })
    .catch((err) => {console.log('There has been an query error', err)});

// Array of CMS options
const selectionArr = [
    'View All Employees', 
    'Add Employee', 
    'Update Employee Role', 
    'View All Roles', 
    'Add Role', 
    'View All Departments', 
    'Add Department',
    'Quit'
];

function start() {
    inquirer.prompt(
        {
            type: 'list',
            name: 'input',
            message: 'What would you like to do?',
            choices: selectionArr
        }
    )
    .then((data) => {
        switch(data.input) {
            case 'View All Employees': viewAllEmployees();
            break;
            case 'View All Departments': viewAllDepartments();
            break;
            case 'View All Roles': viewAllRoles();
            break;
            case 'Quit': db.end();
            break;
        }
    })
    .catch((err) => {console.log('There has been an inquirer error.', err)});
}

function viewAllEmployees() {
    db.promise().query(
    `SELECT 
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
    LEFT JOIN department ON role.department_id = department.id;`)
    .then(([rows, fields]) => {
        console.table(rows)
        start()
    })
    .catch((err) => {console.log('There has been an query error', err)})
};

function viewAllDepartments() {
    db.promise().query('SELECT * FROM department')
    .then(([rows, fields]) => {
        console.table(rows)
        start()
    })
    .catch((err) => {console.log('There has been an query error', err)})
};

function viewAllRoles() {
    db.promise().query(
    `SELECT 
        role.id,
        role.title,
        department.name AS department,
        role.salary
    FROM role
    LEFT JOIN department ON role.department_id = department.id;`)
    .then(([rows, fields]) => {
        console.table(rows)
        start()
    })
    .catch((err) => {console.log('There has been an query error', err)})
}

/* Bonus
    - Update Employee Managers
    - View Employees By Manager
    - View Employees By Department
    - Delete Departments, Roles, and Employees
    - View Total Utilized Budget of a Department (Combined salaries of all employees in specific department)
*/

start();