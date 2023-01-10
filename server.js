const mysql = require('mysql2'); //Imports mysql2 library so we can interact with the mySQL databases;
const inquirer = require('inquirer'); //Imports inquirer library so we can use CLI
const cTable = require('console.table');// Use console.table similiar to console.log. Makes it beautiful!

//Importing classes for role, department, and employee
const Department = require('./lib/department');
const Employee = require('./lib/employee');
const Role = require('./lib/role');

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
            let newRole = new Role(role.id, role.title, role.salary, role.department_id)
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

//Questions for add Employee option
function start() {
    //Creating empty arrays to store row objects to display in inquirer prompts
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
            case 'Quit': db.end();
            break;
        }
    })
    .catch((err) => {console.log('There has been an inquirer error.', err)});
}




/*-----------------------CLI Selection functions ---------------------------*/
//Prompts and adds a new employee based on user input/selection

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
    inquirer.prompt(addEmployeeQuestions)
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
        db.promise().query(`SELECT id FROM employee WHERE first_name = ?`, [data.empFirstName])
        .then(([rows, fields]) => {
            let newEmp = new Employee(rows.id, data.empFirstName, data.empLastName, rId, mId)
            employees.push(newEmp);
        })
        start()
    })
    .catch((err) => {console.log('There has been an query error', err)})
};

function updateEmployee() {
    inquirer.prompt(updateRoleQuestions)
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
        db.promise().query(`INSERT INTO department VALUES ?`, [data.newDep])
        .then(data => console.log('\nDepartment has been added.'))
        .catch(err => console.log('There has been an query error', err))

    })
    .catch(err => console.log('There has been an error!', err))
}

/*----------------------Inquirer Questions-----------------------*/ 
const addEmployeeQuestions = [
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

const updateRoleQuestions = [
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
        choices: () => {
            return roles.map(index => index.title)
        }
    }
]

const addDepartmentQ = [
    {
        type: 'input',
        name: 'newDep',
        message: 'Please enter the department you would like to add.',
        validate: userInput => {
            userInput ? true : console.log('\nPlease enter a valid department name.')
        }
    }
]

start();

/* Bonus
    - Update Employee Managers
    - View Employees By Manager
    - View Employees By Department
    - Delete Departments, Roles, and Employees
    - View Total Utilized Budget of a Department (Combined salaries of all employees in specific department)
*/
