SELECT * FROM employee;

-- View all employees query
SELECT 
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
LEFT JOIN department ON role.department_id = department.id;

-- View all roles including id, title, department, salary
SELECT 
    role.id,
    role.title,
    department.name AS department,
    role.salary
FROM role
LEFT JOIN department ON role.department_id = department.id;

-- View all departments query
SELECT * FROM department;

-- Insert a new department
INSERT INTO department (name)
VALUES ('userInput');

-- Insert a new role
-- Asks user name of new role, salary, and what department
INSERT INTO role (title, salary, department.id)
-- Insert new employee
-- Asks user name of new employee, first and last, role, and manager

-- Update employee role
-- Asks which employee they want to update and asks which role you would like to change


















-- View first name, last name, title, salary, manager id
SELECT
employee.id,
employee.first_name, 
employee.last_name, 
role.title, 
role.salary, 
manager_id AS manager
FROM employee
INNER JOIN role ON employee.role_id = role.id;

-- View employee name and manager name
SELECT e1.first_name, e1.last_name, e2.first_name
AS manager
FROM employee AS e1
LEFT JOIN employee AS e2
ON e1.manager_id = e2.id;