INSERT INTO department (name)
VALUES
        ('Engineering'),
        ('Finance'),
        ('Legal'),
        ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES  
        ('Accountant', 70000, 2),
        ('Account Manager', 100000, 2),
        ('Sales Person', 50000, 4),
        ('Sales Lead', 90000, 4),
        ('Lead Engineer', 160000, 1),
        ('Database Engineer', 120000, 1),
        ('Legal Team Lead', 150000, 3),
        ('Lawyer', 130000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
        (1, 'John', 'Doe', 5, null),
        (2, 'Sarah', 'Burmingham', 6, 1),
        (3, 'Kendal', 'Young', 4, null),
        (4, 'Gregory', 'Rodriguez', 3, 3);
        