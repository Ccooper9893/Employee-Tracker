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

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
        ('John', 'Doe', 5, null),
        ('Sarah', 'Burmingham', 6, 1),
        ('Kendal', 'Young', 4, null),
        ('Gregory', 'Rodriguez', 3, 3),
        ('Jacob', 'Hammond', 6, 1),
        ('Henry', 'Cavil', 7, null),
        ('Ashely', 'Cambell', 8, 6),
        ('Ray', 'Kitson', 2, null),
        ('Sage', 'Cooper', 3, 3),
        ('Richard', 'Bush', 6, 1),
        ('Ryan', 'Dow', 8, 6),
        ('Veronica', 'Vaughn', 1, 8),
        ('Billy', 'Madison', 8, 6),
        ('Riley', 'Cena', 1, 8),
        ('Dwayne', 'Johnson', 1, 8);
        