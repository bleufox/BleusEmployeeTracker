const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Ophelia2012*',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select from the options below:',
                name: 'choice',
                choices: [
                    {
                        name: "View all Departments",
                        value: "viewDepartments"
                    },
                    {
                        name: "View all Roles",
                        value: "viewRoles"
                    },
                    {
                        name: "Add a Department",
                        value: "newDepartment"
                    },
                    {
                        name: "Add a Role",
                        value: "newRole"
                    },
                    {
                        name: "Add an Employee",
                        value: "newEmployee"
                    },
                    {
                        name: "Update Existing Employee Role",
                        value: "existingRole"
                    }
                ]
            }
        ]).then(result => {
            switch (result.choice) {
                case "viewDepartments":
                    viewDepartments();
                    break;
                case "viewRoles":
                    viewRoles();
                    break;
                case "newDepartment":
                    newDepartment();
                    break;
                case "newRole":
                    newRole();
                    break;
                case "newEmployee":
                    newEmployee();
                    break;
                case "existingRole":
                    existingRole();
                    break;
                default:
                    exit()
            }
        })
}

const viewDepartments = () => {
    db.query(`SELECT * FROM department`, (err, data) => {
        if (err) {
            throw err
        } else {
            console.table(data);
            mainMenu();
        }
    })
}

const viewRoles = () => {
    db.query(`SELECT * FROM role`, (err, data) => {
        if (err) {
            throw err
        } else {
            console.table(data);
            mainMenu();
        }
    })
}

const newDepartment = () => {
    inquirer
        .prompt({
            name: 'department',
            message: 'Please provide the name of the new department.'
        }).then(function (response) {
            db.query(`INSERT INTO department (department_name) VALUES (?)`, response.department, (err) => {
                if (err) {
                    throw err
                }
                else {
                    viewDepartments();
                    mainMenu();
                }
            })
        }
,)
}

const newRole = () => {
    inquirer
        .prompt({
            name: 'role',
            message: 'Please provide the title and salary of the new role.'
        }).then(function (response) {
            db.query(`INSERT INTO role (title, salary) VALUES (?)`, response.role, (err) => {
                if (err) {
                    throw err
                }
                else {
                    viewRoles();
                    mainMenu();
                }
            })
        }
,)
}

mainMenu();