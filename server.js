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
                message: 'What do you want to do?',
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
    // run database query to view departments
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
    // run database query to view departments
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
    // run database query to view departments
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
    // run database query to view departments
}



// function viewRoles() {
//     // run this query
// }

mainMenu();