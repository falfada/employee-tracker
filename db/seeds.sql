DO $$
DECLARE
BEGIN
-- Inserting data into department table
INSERT INTO department(name) VALUES
('Marketing'),
('Human Resources'),
('IT'),
('Customer Service'),
('Quality Assurance');

-- Inserting data into role table
INSERT INTO role (title, salary, department_id) VALUES
('SEO Specialist', 70000, 1),
('Database Administrator', 90000, 3),
('QA Tester', 70000, 5),
('HR Manager', 100000,2),
('Help Desk Technician', 60000, 4),
('Software Developer', 80000, 3),
('IT Project Manager', 120000, 3),
('QA Manager', 110000, 5),
('Marketing Manager', 100000, 1),
('Customer Success Manager', 90000, 4);

-- Inserting data into employee table
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES
('Emily', 'Johnson', 9, NULL),
('Michael', 'Smith', 4, NULL),
('Olivia', 'Williams', 7, NULL),
('James', 'Brown', 8, NULL),
('Alexander', 'Andersons', 10, NULL),
('Sophia', 'Miller', 1, 1),
('Benjamin', 'Davis', 2, 3),
('Ava', 'Garcia', 3, 4),
('Mia', 'Wilson', 5, 5),
('Charlotte', 'Thompson', 6, 3),
('Daniel', 'Moore', 6, 3),
('Amelia', 'White', 6, 3),
('Harper', 'Clark', 5, 5),
('Ethan', 'Lewis', 1, 1),
('Evelyn', 'Walker', 2, 3),
('Henry', 'Hall', 3, 4),
('Isabella', 'Rodriguez', 6, 3),
('William', 'Martinez', 2, 3);

RAISE NOTICE 'Transaction complete';

EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'An error occurred: %', SQLERRM;
ROLLBACK;
END $$;