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
      // Add functions for inquirer questions
  );

//Query company database to save tables with information to an related arrays
db.query('SELECT * FROM employee;', (err, row) => {
    if (err) {
        console.log(err)
    }
    for (emp of row) {
        let newEmp = new Employee(emp.id, emp.first_name, emp.last_name, emp.role_id, emp.manager_id)
        employees.push(newEmp);
    }
});

db.query('SELECT * FROM role;', (err, row) => {
    if (err) {
        console.log(err)
    }
    for (role of row) {
        let newRole = new Role(role.title, role.salary, role.department_id)
        roles.push(newRole)
    }
    console.log(roles)
});

db.query('SELECT * FROM department;', (err, row) => {
    if (err) {
        console.log(err)
    }
    for (dep of row) {
        let newDep = new Department(dep.id, dep.name)
        departments.push(newDep)
    }
});

// Array of CMS options
const selectionArr = [
    'View All Employees', 
    'Add Employee', 
    'Update Employee Role', 
    'View All Roles', 
    'Add Role', 
    'View All Departments', 
    'Add Department'
];

/* Bonus
    - Update Employee Managers
    - View Employees By Manager
    - View Employees By Department
    - Delete Departments, Roles, and Employees
    - View Total Utilized Budget of a Department (Combined salaries of all employees in specific department)
*/