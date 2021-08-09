INSERT INTO department
    (department_name)
VALUES
    ('IT'),
    ('Human Resources'),
    ('Engineering');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('HR Director', 85000, 2),
    ('IT Manager', 95000, 1),
    ('Engineer III', 105000, 3),
    ('Engineer Intern', 45000, 3);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Dave', 'Smith', 2, NULL),
    ('Courtney', 'Green', 1, NULL),
    ('Matt', 'Garcia', 4, 2),
    ('Sally', 'Jones', 3, NULL);