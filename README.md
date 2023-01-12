# Employee-Tracker


# *Note Taker Starter Code*
![Badge image](https://img.shields.io/badge/license-MIT-green})

## *Description*
___
A command line application Content Management System (CMS) using Javascript, Node.js, Inquirer, and MySQL. Built for non-developers to easily view and interact with employee information. This application includes the following features: 
- View all Employees
    - View Employees by Manager
    - View Employees by Department
    - Update Employee Roles
    - Update Employee Managers
    - Add Employees
    - Delete Employees 
- View all Roles
    - Add Role
- View all Departments
    - Add Department
- View Budget

## *Table of Contents*
 ___
  - [Installation](#installation)
  - [Usage](#usage)
  - [Software](#software)
  - [License](#license)
  - [Questions](#questions)

## *Installation*
___
Guidelines for installing this application:
1. Clone the repository onto your machine https://github.com/Ccooper9893/Team-Profile-Generator
2. Install node.js, if applicable. https://coding-boot-camp.github.io/full-stack/nodejs/how-to-install-nodejs
3. Install the dependencies by typing **npm install** in the command line and pressing enter.

## *Usage*
___
Step for using this application:
- Click and type your note into the text input area.
- To save your note, click the save icon on the top right of the webpage
- To view your note, click on the note you would like to view.
- To create a new note, click on the + icon to clear the text area.
- To delete your note, select the note you would like to delete and click the trashcan icon.

![alt text](./public/assets/images/NoteTakerScrshot.png "Screenshot of note taker application")


## *Software*
___
This application was created using the following software:
- HTML5
- CSS3
- Javascript ES6
- Node.js
- Express.js
- uuidv4
- VS Code

## *License*
___
This application is covered under the MIT license.
For more information about this license please visit https://opensource.org/licenses/MIT

## *Questions*
___
For questions or concerns please contact me via Github.
  - Github: https://github.com/ccooper9893
  - Github Repository: https://github.com/Ccooper9893/Note-Taker.git
## User Story
AS A business owner
I WANT to be able to view and manage the departments, roles and employees in my company
SO THAT I can organize and plan my business

## Acceptance Criteria
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database

## Demo
<img src="./assets/images/12-sql-homework-demo-01.png" alt="SQL Tables required for application">