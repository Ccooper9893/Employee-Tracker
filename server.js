const mysql = require('mysql2'); //Imports mysql2 library so we can interact with the mySQL databases;
const inquirer = require('inquirer'); //Imports inquirer library so we can use CLI
const cTable = require('console.table');// Use console.table similiar to console.log. Makes it beautiful!
require('dotenv').config();//Environmental variables

//Importing classes for role, department, and employee
const Department = require('./lib/department');
const Employee = require('./lib/employee');
const Role = require('./lib/role');

//Create empty arrays to store database tables into
let departments;
let employees;
let roles;
let managers;

/*-----------------------Application start up functions------------------------*/
//Connect to the MySQL database
const db = mysql.createConnection(
      {
          host: 'localhost',
          user: process.env.DB_USER, //MySQL username from .env file
          password: process.env.DB_PASSWORD, //MySQL password from .env file
          database: process.env.DB_NAME //MySQL database name from .env file
      },
      console.log('\x1b[33m%s\x1b[0m','You have connected to the company_db database.')
);

//Query functions to grab and store tabular data from mysql database at start of application
function queryEmployees() {
    employees = [];
    managers = [];
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
            for (row of rows) {
                let newEmployee = new Employee(row.id, row.first_name, row.last_name, row.title, row.department, row.salary, row.manager);
                employees.push(newEmployee);
                if (row.manager_id == null) {
                    managers.push(newEmployee);
                };
            };
        })
        .catch(err => console.log('\033[31m','There has been an query error', err));
    //   .then(([rows, fields]) => {
    //     for (emp of rows) {
    //         let newEmp = new Employee(emp.id, emp.first_name, emp.last_name, emp.role_id, emp.manager_id)
    //         employees.push(newEmp);
    //         if (emp.manager_id == null) {
    //             managers.push(newEmp)
    //         }
    //     }
    //   })
    //   .catch((err) => {console.log('There has been an query error', err)});
};

function queryRoles() {
    roles = [];
db.promise().query('SELECT * FROM role;')
    .then(([rows, fields]) => {
        for (role of rows) {
            let newRole = new Role(role.id, role.title, role.salary, role.department_id); //Create new role objects
            roles.push(newRole); //Push role object onto array
        }
    })
    .catch(err => console.log('\033[31m','There has been an query error', err));    
};

function queryDepartments() {
    departments = [];
db.promise().query('SELECT * FROM department;')
    .then(([rows, fields]) => {
        for (dep of rows) {
            let newDep = new Department(dep.id, dep.name);
            departments.push(newDep);
        };
    })
    .catch(err => console.log('\033[31m','There has been an query error', err));
};

// Array of CMS options for user selection
const mainMenuOptions = [
    'View Employees',
    'Update Employees',
    'View All Roles', 
    'Add Role', 
    'View All Departments', 
    'Add Department',
    'View Budget',
    'Quit'
];

const employeeMenuOptions = [
    'Add Employee', 
    'Update Employee Role',
    'Update Employee Manager',
    'Delete Employee',
    'Back'
];

const viewEmployeeOptions = [
    'View All Employees',
    'View Employees by Manager',
    'View Employees by Department',
    'Back'
];

//Begin inquirer prompt and display option menu for CMI (Content Management System)
function start() {
    queryDepartments();
    queryEmployees();
    queryRoles();

    inquirer.prompt(
        {
            type: 'list',
            name: 'input',
            message: 'What would you like to do?',
            choices: mainMenuOptions
        }
    )
    .then((data) => {
        switch(data.input) {
            case 'View Employees': viewOptions(); 
            break;
            case 'Update Employees': employeeOptions();
            break;
            case 'View All Roles': viewAllRoles();
            break;
            case 'Add Role' : addRole();
            break;
            case 'View All Departments': viewAllDepartments();
            break;
            case 'Add Department': addDepartment();
            break;
            case 'View Budget': showTotalBudget();
            break;
            case 'Quit': db.end();
            break;
        };
    })
    .catch(err => console.log('\033[31m','There has been an inquirer error.', err));
};

function employeeOptions() {
    inquirer.prompt(
        {
            type: 'list',
            name: 'selection',
            message: 'Choose an option',
            choices: employeeMenuOptions
        }
    )
    .then(data => {
        switch(data.selection) {
            case 'Add Employee': addEmployee();
            break;
            case 'Update Employee Role': updateEmployee();
            break;
            case 'Update Employee Manager': updateManager();
            break;
            case 'Delete Employee': deleteEmployees();
            break;
            case 'Back' : start();
        }
    })
    .catch(err => console.log('\033[31m','There has been an error!', err));
};

function viewOptions() {
    inquirer.prompt(
        {
            type: 'list',
            name: 'selection',
            message: 'Choose an option',
            choices: viewEmployeeOptions
        }
    )
    .then(data => {
        switch(data.selection) {
            case 'View All Employees': viewAllEmployees();
            break;
            case 'View Employees by Manager': sortByManager();
            break;
            case 'View Employees by Department': sortByDepartment();
            break;
            case 'Back': start();
        }
    })
    .catch(err => console.log('\033[31m','There has been an query error', err));
}

start();
/*-----------------------CLI Selection functions ---------------------------*/

function viewAllEmployees() {
  console.table(employees);
  start();
};

function viewAllDepartments() {
    db.promise().query('SELECT * FROM department')
    .then(([rows, fields]) => {
        console.table(rows);
        start();
    })
    .catch(err => console.log('\033[31m','There has been an query error', err));
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
        console.table(rows);
        start();
    })
    .catch(err => console.log('\033[31m','There has been an query error', err));
};

function addEmployee() {
    inquirer.prompt(addEmployeeQ)
    .then((data) => {

        let mId;
        //Grabs the manager id of the selected manager
        if (data.empManager == 'None') {
            mId = null;
        } else {
            mId = employees[employees.map(e => e.first_name).indexOf(data.empManager)].id;
        }

        //Grabs the role id of the selected position
        let rId = roles[roles.map(e => e.title).indexOf(data.empRole)].id;
        
        db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [data.empFirstName, data.empLastName, rId, mId])
            .catch(err => console.log('\033[31m','There has been an query error', err));
        // db.promise().query(`SELECT id FROM employee WHERE first_name = ?`, [data.empFirstName])
        // .then(([rows, fields]) => {
        //     let newEmp = new Employee(rows.id, data.empFirstName, data.empLastName, rId, mId)
        //     employees.push(newEmp);
        // })
        console.log('\x1b[33m%s\x1b[0m',`The employee has been added to the company database.`);
        start();
    })
    .catch(err => console.log('\033[31m','There has been an query error', err));
};

function updateEmployee() {
    inquirer.prompt(updateRoleQ)
    .then(data => {

        //Mapping through roles to find role ids that equal user choice
        let rId = roles[roles.map(index => index.title).indexOf(data.roleChoice)].id;

        db.promise().query(`UPDATE employee SET role_id = ? WHERE first_name = ?`, [rId, data.empChoice])
        // .then(data => console.log(`Role has been updated.`))
        .catch(err => console.log('\033[31m','There has been an query error', err));
        console.log('\x1b[33m%s\x1b[0m',`Role has been updated.`);
        start();
    })
    .catch(err => console.log('\033[31m','There has been an query error', err));
    
};

function addDepartment() {
    inquirer.prompt(addDepartmentQ)
    .then((data) => {
        db.promise().query(`INSERT INTO department (name) VALUES (?)`, [data.newDep])
            .catch(err => console.log('\033[31m','There has been an query error', err));
        console.log('\x1b[33m%s\x1b[0m','Department has been added.');
        start();
    })
    .catch(err => console.log('There has been an error!', err));
};

function addRole() {
    inquirer.prompt(addRoleQ)
    .then((data) => { 
        //Grabs the department id of selected department
        let dId = departments[departments.map(e => e.name).indexOf(data.desDep)].id;

        db.promise().query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [data.newRole, data.newSal, dId])
            .catch(err => console.log('\033[31m','There has been an query error', err));

        console.log('\x1b[33m%s\x1b[0m','Role has been added.');
        start();
    })
    .catch(err => console.log('\033[31m','There has been an error!', err));
};

function updateManager() {
    inquirer.prompt(updateManagerQ)
    .then(data => {

        //Grabs Ids for employee managers
        let mId = employees[employees.map(index => index.first_name).indexOf(data.man)].id;

        db.promise().query(`UPDATE employee SET manager_id = ? WHERE first_name = ?`, [mId, data.emp])
            .catch(err => console.log('\033[31m','There has been an query error', err));

        console.log('\x1b[33m%s\x1b[0m','You have changed the employee\'s manager.');
        start();
    })  
    .catch(err => console.log('\033[31m','There has been an error!', err));
};

function sortByManager() {
    inquirer.prompt(employeeByManagerQ)
    .then(data => {
        // let mId = employees[employees.map(index => index.first_name).indexOf(data.man)].id;
        let managerEmps = []
        for (emp of employees) {
            if (data.man === emp.manager) {
                managerEmps.push(emp)
            }
        }
        console.table(managerEmps);

        // db.promise().query(`SELECT id, first_name, last_name FROM employee WHERE manager_id = ?`, [mId])
        //     .then(([rows, fields])=> {
        //         console.table(rows);
        //     })
        //     .catch(err => console.log('\033[31m','There has been an query error', err));
        start();
    })
    .catch(err => console.log('\033[31m','There has been an error!', err));
};

function sortByDepartment() {
    inquirer.prompt(employeebyDepartmentQ)
    .then(data => {
        empArr = employees.filter(emp => emp.department === data.dep);
        console.table(empArr);
        // let depId = departments[departments.map(e => e.name).indexOf(data.dep)].id;
        // let rolesArr = roles.filter(role => role.department_id === depId);
        // let roleIds = rolesArr.map(e => e.id);
        // for (role of roleIds) {
        //     db.promise().query(`SELECT * FROM employee WHERE role_id = ?`, [role])
        //     .then(([rows, fields]) => console.table(rows))
        //     .catch(err => console.log(err))
        // }
        start();
    })
    .catch(err => console.log('\033[31m','There has been an error!', err));
};

function deleteEmployees() {
    inquirer.prompt(deleteEmployeeQ)
    .then(data => {
        //Grabs id of selected employee
        eId = employees[employees.map(e => e.first_name).indexOf(data.emp)].id;
        db.promise().query(`DELETE FROM employee WHERE id = ?`, [eId])
            .catch(err => console.log('\033[31m','There has been an query error', err));
            console.log('\x1b[33m%s\x1b[0m','Employee deleted!');
        start();
    })
    .catch(err => console.log('\033[31m','There has been an error!', err));
};

function showTotalBudget() {
    inquirer.prompt(totalBudgetQ)
    .then(data => {
        let total = 0;
        for (emp of employees) {
            if (emp.department === data.dep && data.dep !== 'All Departments') {
                let sal = parseInt(emp.salary);
                total = total + sal;
            } else if (data.dep === 'All Departments') {
                let sal = parseInt(emp.salary);
                total = total + sal;
            }
        }
        console.log('\x1b[33m%s\x1b[0m',`The budget of ${data.dep} department is $${total}.`);
        start();
    })
    .catch(err => console.log('\033[31m','There has been an error!', err));
};

/*-----------------------------------Inquirer Questions-----------------------------------------------*/

const addEmployeeQ = [
    {
        type: 'input',
        name: 'empFirstName',
        message: 'What is the employee\'s first name?',
        validate: userInput => {
            return userInput ? true : console.log('\033[31m','Please enter a valid name.')
        }
    },
    {
        type: 'input',
        name: 'empLastName',
        message: 'What is the employee\'s last name?',
        validate: userInput => {
            return userInput ? true : console.log('\033[31m','Please enter a valid name.')
        }
    },
    {
        type: 'list',
        name: 'empRole',
        message: 'What is the employee\'s role?',
        choices: () => {
            return roles.map(index => index.title);
        }
    },
    {
        type: 'list',
        name: 'empManager',
        message: 'Who is the employee\'s manager?',
        choices: () => {
            manArr = managers.map(e => e.first_name);
            manArr.push('None');
            return manArr
        }
    }
];

const updateRoleQ = [
    {
    type: 'list',
    name: 'empChoice',
    message: 'Which employee would you like to update?',
    choices: () => {
        return employees.map(index => index.first_name); 
        }
    },
    {
        type: 'list',
        name: 'roleChoice',
        message: 'What is the employee\'s new role?',
        choices: () => {
            return roles.map(index => index.title);
        }
    }
];

const addDepartmentQ = [
    {
        type: 'input',
        name: 'newDep',
        message: 'Please enter the department you would like to add.',
        vaidate: userInput => {
            return isNaN(userInput) ? true : console.log('\033[31m','Please enter a valid department.')
        }
    }
];

const addRoleQ = [
    {
        type: 'input',
        name: 'newRole',
        message: 'Please enter a role you would like to add.',
        validate: userInput => {
            return userInput ? true : console.log('\033[31m','Please enter a valid role!')
        }
    },
    {
        type: 'input',
        name: 'newSal',
        message: 'Please enter the salary of this postion in dollars. Ex. 150000 for $150,000 a year.',
        validate: userInput => {
           return !isNaN(userInput) ? true : console.log('\033[31m','Please enter a number. Do not include commas!')
        }
    },
    {
        type: 'list',
        name: 'desDep',
        message: 'Please choose which department this role should be designated.',
        choices: () => {
            return departments.map(index => index.name)
        }
        
    }
];

const updateManagerQ = [
    {
        type: 'list',
        name: 'emp',
        message: 'Please choose an employee whose manager you want to change.',
        choices: () => {
            return employees.map(index => index.first_name); 
            }
    },
    {
        type: 'list',
        name: 'man',
        message: 'Please choose the manager that you would like assign to the employee.',
        choices: () => {
            return managers.map(index => index.first_name)
            }
    }
];

const employeeByManagerQ = [
    {
        type: 'list',
        name: 'man',
        message: 'Please choose a manager you would like to sort the employees by.',
        choices: () => {
            return managers.map(index => index.first_name)
            }
    }
];

const employeebyDepartmentQ = [
    {
        type: 'list',
        name: 'dep',
        message: 'Please choose a department you would like to sort the employees by.',
        choices: () => {
            return departments.map(index => index.name)
            }
    }
];

const deleteEmployeeQ = [
    {
        type: 'list',
        name: 'emp',
        message: 'Which employee would you like to delete?',
        choices: () => {
            return employees.map(e => (e.last_name, e.first_name))
        }
    }
];

const deleteDepartmentQ = [
    {
        type: 'list',
        name: 'dep',
        message: 'Which employee would you like to delete?',
        choices: () => {
            return departments.map(e => e.name)
        }
    }
];

const deleteRoleQ = [
    {
        type: 'list',
        name: 'rol',
        message: 'Which role would you like to delete?',
        choices: () => {
            return roles.map(e => e.title)
        }
    }
];

const totalBudgetQ = [
    {
        type: 'list',
        name: 'dep',
        message: 'Please choose a department.',
        choices: () => {
            let deps = departments.map(e => e.name)
            deps.push('All Departments')
            return deps 
        } 
    }
];

/* Bonus
    - View Employees By Manager
        //Inquirer prompt for selection of manager list: for (man of managers) id = man.id
        //Use that manager's id to select all from employees where manager_id = ? for (emp of employees) manager_id = man.id
        //Display list of employees that satisfies manager_id = ^ console.table(array of employee objects)
    - View Employees By Department
        //Inquirer prompt for selection of departments list: for (dep of deps) from collection of dep objects
        //Find and use department id to select all from employees where employee.department_id = ?
        //Display list of of those employees
    - Delete Departments, Roles, and Employees
        //Inquirer if user wants to delete a department, role, or employee
        // list: for (emp of employees) list: for (dep of departments) list: for (role of roles);
        //DELETE FROM department WHERE id = department_id
        //DELETE FROM employees WHERE id = employee_id
        //DELETE FROM roles WHERE id = role_id
    - View Total Utilized Budget of a Department (Combined salaries of all employees in specific department)
        //Inquirer user which department they would like to see total employee salaries
*/

//Needs work, Error: Cannot delete or update a parent row.
function deleteData() {
    inquirer.prompt(
        {
            type: 'list',
            name: 'choice',
            message: 'Which category would you like to delete from?',
            choices: ['Departments', 'Roles', 'Employees']
        }
    ).then(data => {
        switch(data.choice) {
            case 'Departments': deleteDepartments();
            break;
            case 'Roles' : deleteRoles();
            break;
            case 'Employees' : deleteEmployees();
            break;
        }
    })
    .catch(err => console.log('There has been an error!', err))
};

//Needs work, Error: Cannot delete or update a parent row.
function deleteDepartments() {
    inquirer.prompt(deleteDepartmentQ)
    .then(data => {
        dId = departments[departments.map(e => e.name).indexOf(data.dep)].id
        console.log(dId)
        db.promise().query(`SET FOREIGN_KEY_CHECKS=0; DELETE FROM department WHERE id = ?; SET FOREIGN_KEY_CHECKS=1;`, [dId])
            .then(() => console.log('Department deleted!'))
            .catch(err => console.log('There has been an query error', err))
        start();
    })
    .catch(err => console.log('There has been an error!', err))
};

//Needs work, Error: Cannot delete or update a parent row.
function deleteRoles() {
    inquirer.prompt(deleteRoleQ)
    .then(data => {
        rId = roles[roles.map(e => e.title).indexOf(data.rol)].id
        db.promise().query(`DELETE FROM role WHERE id = ?`, [rId])
            .catch(err => console.log('\033[31m','There has been an query error', err))
        console.log('Role deleted!')
        start();
    })
    
    .catch(err => console.log('\033[31m','There has been an error!', err))
};
