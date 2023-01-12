const mysql = require('mysql2'); //Imports mysql2 library so we can interact with the mySQL databases;
const inquirer = require('inquirer'); //Imports inquirer library so we can use CLI
const cTable = require('console.table');// Use console.table similiar to console.log. Makes it beautiful!

//Importing classes for role, department, and employee
const Department = require('./lib/department');
const Employee = require('./lib/employee');
const Role = require('./lib/role');

//Create empty arrays to store database tables into
let departments;
let employees;
let roles;
let managers;
//Connect to the MySQL database
const db = mysql.createConnection(
      {
          host: 'localhost',
          user: 'root', //MySQL username
          password: '', //MySQL password
          database: 'company_db' //MySQL database name
      },
      console.log('You have connected to the company_db database.')
);

//Query functions to grab and store tabular data from mysql database
function queryEmployees() {
    employees = [];
    managers = [];
db.promise().query('SELECT * FROM employee;')
      .then(([rows, fields]) => {
        for (emp of rows) {
            let newEmp = new Employee(emp.id, emp.first_name, emp.last_name, emp.role_id, emp.manager_id)
            employees.push(newEmp);
            if (emp.manager_id == null) {
                managers.push(newEmp)
            }
        }
      })
      .catch((err) => {console.log('There has been an query error', err)});
}

function queryRoles() {
    roles = [];
db.promise().query('SELECT * FROM role;')
    .then(([rows, fields]) => {
        for (role of rows) {
            let newRole = new Role(role.id, role.title, role.salary, role.department_id)
            roles.push(newRole)
        }
    })
    .catch((err) => {console.log('There has been an query error', err)});    
}

function queryDepartments() {
    departments = [];
db.promise().query('SELECT * FROM department;')
    .then(([rows, fields]) => {
        for (dep of rows) {
            let newDep = new Department(dep.id, dep.name)
            departments.push(newDep)
        }
    })
    .catch((err) => {console.log('There has been an query error', err)});
}

// Array of CMS options
const selectionArr = [
    'View All Employees', 
    'Add Employee', 
    'Update Employee Role',
    'Update Employee Manager',
    'View Employees by Manager',
    'View Employees by Department',
    'View All Roles', 
    'Add Role', 
    'View All Departments', 
    'Add Department',
    'Quit'
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
            choices: selectionArr
        }
    )
    .then((data) => {
        switch(data.input) {
            case 'View All Employees': viewAllEmployees();
            break;
            case 'Add Employee': addEmployee();
            break;
            case 'Update Employee Role': updateEmployee();
            break;
            case 'View All Roles': viewAllRoles();
            break;
            case 'Add Role' : addRole();
            break;
            case 'View All Departments': viewAllDepartments();
            break;
            case 'Add Department': addDepartment();
            break;
            case 'Update Employee Manager': updateManager();
            break;
            case 'View Employees by Manager': sortByManager();
            break;
            case 'View Employees by Department': sortByDepartment();
            break;
            case 'Quit': db.end();
            break;
        }
    })
    .catch((err) => {console.log('There has been an inquirer error.', err)});
}

/*-----------------------CLI Selection functions ---------------------------*/
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

function addEmployee() {
    inquirer.prompt(addEmployeeQ)
    .then((data) => {

        let mId;
        //Grabs the manager id of the selected manager
        if (data.empManager == 'None') {
            mId = null
        } else {
            mId = employees[employees.map(e => e.first_name).indexOf(data.empManager)].id;
        }

        //Grabs the role id of the selected position
        let rId = roles[roles.map(e => e.title).indexOf(data.empRole)].id;
        
        db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [data.empFirstName, data.empLastName, rId, mId])
        .then((data) => {
            console.log(`\nThe employee has been added to the company database.`)
            // let newEmp = new Employee(emp.id, emp.first_name, emp.last_name, emp.role_id, emp.manager_id)
            // employees.push(newEmp);
            
            })
        .catch(err => console.log(err));
        // db.promise().query(`SELECT id FROM employee WHERE first_name = ?`, [data.empFirstName])
        // .then(([rows, fields]) => {
        //     let newEmp = new Employee(rows.id, data.empFirstName, data.empLastName, rId, mId)
        //     employees.push(newEmp);
        // })
        start()
    })
    .catch((err) => {console.log('There has been an query error', err)})
};

function updateEmployee() {
    inquirer.prompt(updateRoleQ)
    .then(data => {
        let rId = roles[roles.map(index => index.title).indexOf(data.roleChoice)].id
        let empIndex = employees.map(index => index.first_name).indexOf(data.empChoice);
        employees[empIndex].role_id = rId;
        db.promise().query(`UPDATE employee SET role_id = ? WHERE first_name = ?`, [rId, data.empChoice])
        .then(data => console.log(`\nRole has been updated.`))
        .catch(err => console.log(err))
        start()
    })
    .catch(err => console.log(err))
    
};

function addDepartment() {
    inquirer.prompt(addDepartmentQ)
    .then((data) => {
        
        db.promise().query(`INSERT INTO department (name) VALUES (?)`, [data.newDep])
        .then((data) => {
            console.log('\nDepartment has been added.')
        })
        .catch(err => console.log('There has been an query error', err))

        start()
    })
    .catch(err => console.log('There has been an error!', err))
}

function addRole() {
    inquirer.prompt(addRoleQ)
    .then((data) => {
        //Grabs the department id of selected department
        let dId = departments[departments.map(e => e.name).indexOf(data.desDep)].id;

        db.promise().query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [data.newRole, data.newSal, dId])
            .then(() => console.log('Role has been added.'))
            .catch(err => console.log('There has been an query error', err))
                
        start();
    })
    .catch(err => console.log('There has been an error!', err))
}

function updateManager() {
    inquirer.prompt(updateManagerQ)
    .then(data => {

        //Grabs Ids for both the employee for update and manager replacing
        let eId = employees.map(index => index.first_name).indexOf(data.emp)
        let mId = employees[employees.map(index => index.first_name).indexOf(data.man)].id

        db.promise().query(`UPDATE employee SET manager_id = ? WHERE first_name = ?`, [mId, data.emp])
        .then(data => console.log('You have changed the employee\'s manager.'))
        .catch(err => console.log('There has been an query error', err))

        employees[eId].manager_id = mId;
        start()
    })  
    .catch(err => console.log('There has been an error!', err))
}

function sortByManager() {
    console.log(employees.length)
    inquirer.prompt(employeeByManagerQ)
    .then(data => {
        let mId = employees[employees.map(index => index.first_name).indexOf(data.man)].id
        // db.promise().query(`SELECT id, first_name, last_name FROM employee WHERE manager_id = ?`, [mId])
        db.promise().query(`SELECT id, first_name, last_name FROM employee WHERE manager_id = ?`, [mId])
            .then(([rows, fields])=> {
                console.table(rows)
            })
            .catch(err => console.log('There has been an query error', err))
        start()
    })
    .catch(err => console.log('There has been an error!', err))
}

//Need help here!!!
function sortByDepartment() {
    inquirer.prompt(employeebyDepartment)
    .then(data => {
        let depId = departments[departments.map(e => e.name).indexOf(data.dep)].id;
        let rolesArr = roles.filter(role => role.department_id === depId);
        let roleIds = rolesArr.map(e => e.id);
        for (role of roleIds) {
            db.promise().query(`SELECT * FROM employee WHERE role_id = ?`, [role])
            .then(([rows, fields]) => console.table(rows))
            .catch(err => console.log(err))
        }
        
    })
    .catch(err => console.log('There has been an error!', err))
}

/*----------------------Inquirer Questions-----------------------*/ 
const addEmployeeQ = [
    {
        type: 'input',
        name: 'empFirstName',
        message: 'What is the employee\'s first name?',
        validate: userInput => {
            return userInput ? true : console.log('Please enter a valid name.')
        }
    },
    {
        type: 'input',
        name: 'empLastName',
        message: 'What is the employee\'s last name?',
        validate: userInput => {
            return userInput ? true : console.log('Please enter a valid name.')
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
            let mgs = ['None']
            for (emp of employees) {
                if (emp.manager_id === null) {
                    mgs.push(emp.first_name)
                }
            }
            return mgs
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
]

const addDepartmentQ = [
    {
        type: 'input',
        name: 'newDep',
        message: 'Please enter the department you would like to add.',
        vaidate: userInput => {
            return isNaN(userInput) ? true : console.log('Please enter a valid department.')
        }
    }
]

const addRoleQ = [
    {
        type: 'input',
        name: 'newRole',
        message: 'Please enter a role you would like to add.',
        validate: userInput => {
            return userInput ? true : console.log('Please enter a valid role!')
        }
    },
    {
        type: 'input',
        name: 'newSal',
        message: 'Please enter the salary of this postion in dollars. Ex. 150000 for $150,000 a year.',
        validate: userInput => {
           return !isNaN(userInput) ? true : console.log('Please enter a number. Do not include commas!')
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
]

const employeebyDepartment = [
    {
        type: 'list',
        name: 'dep',
        message: 'Please choose a department you would like to sort the employees by.',
        choices: () => {
            return departments.map(index => index.name)
            }
    }
];

start();

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
        //
*/
