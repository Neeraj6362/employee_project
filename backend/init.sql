CREATE TABLE IF NOT EXISTS employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    joining_date DATE,
    relieving_date DATE,
    role VARCHAR(50)
);

INSERT INTO employees (emp_id, name, email, joining_date, relieving_date, role) VALUES
(101, 'Sravan Kumar', 'sravan@example.com', '2020-01-10', '2023-11-01', 'Software Engineer'),
(102, 'Priya R', 'priya@example.com', '2019-03-14', NULL, 'Team Lead')
ON DUPLICATE KEY UPDATE name = VALUES(name);
