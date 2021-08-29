const mysql = require('mysql');
const cTable = require('console.table');
const inquirer = require('inquirer');
const divider = '--------------------------------------------------------------------'

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
                        name: "View all Employees",
                        value: "viewEmployees"
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
                        name: "Update an Existing Employee Role",
                        value: "updateRole"
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
                case "viewEmployees":
                    viewEmployees();
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
                case "updateRole":
                    updateRole();
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
            console.log(divider)
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
            console.log(divider)
            console.table(data);
            mainMenu();
        }
    })
}

const viewEmployees = () => {
    db.query(`SELECT * FROM employee`, (err, data) => {
        if (err) {
            throw err
        } else {
            console.log(divider)
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
            db.query(`INSERT INTO department (department_name) VALUES (?)`, response.department, (err, data) => {
                if (err) {
                    throw err
                }
                else {
                    // console.table(data)
                    mainMenu();
                }
            })
        }
,)
}

const newRole = () => {
    db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err
        inquirer.prompt([
            {
                type: "input",
                name: 'title',
                message: 'Please provide the title.'
            },
            {
                type: "input",
                name: 'salary',
                message: 'Please provide the salary.'
            },
            {
                type: "list",
                name: 'departmentName',
                message: 'Please select the department name.',
                choices() {
                    const departmentArray = [];
                    result.forEach(({ department_name }) => {
                        departmentArray.push(department_name)
                    })
                    return departmentArray;
                },
            },
        ])
            .then(response => {
                db.query(`SELECT id FROM department WHERE department_name=?`, response.departmentName, (err, data) => {
                    if (err) {
                        throw err
                    } else {
                        let dep = JSON.stringify(data[0].id)
                        db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [response.title, response.salary, dep], (err) => {
                            if (err) {
                                throw err
                            } else {
                                mainMenu();
                            }
                        }
                        )
                    }
                }
                )
            })
    })
}

const newEmployee = () => {
    db.query(`SELECT * FROM role`, (err, result) => {
        if (err) throw err
        inquirer.prompt([
            {
                type: "input",
                name: 'firstName',
                message: "Please provide the employee's first name."
            },
            {
                type: "input",
                name: 'lastName',
                message: "Please provide the employee's last name."
            },
            {
                type: "list",
                name: 'title',
                message: "Please select the new employee's title.",
                choices() {
                    const roleArray = [];
                    result.forEach(({ title }) => {
                        roleArray.push(title)
                    })
                    return roleArray;
                }
            },
        ])
            .then(response => {
                db.query(`SELECT id FROM role WHERE title=?`, response.title, (err, results) => {
                    if (err) {
                        throw err
                    } else {
                        let title = JSON.stringify(results[0].id)
                        db.query(`SELECT * FROM employee`, (err, data) => {
                            if (err) throw err;
                            inquirer.prompt([{
                                type: 'list',
                                name: "manager",
                                message: "Select the new employee's manager.",
                                choices() {
                                    const managerArray = ['none'];
                                    data.forEach(({ first_name, last_name }) => {
                                        managerArray.push(`${first_name} ${last_name}`)
                                    })
                                    return managerArray;
                                }
                            }
                            ])
                                .then(answer => {
                                    db.query(`SELECT id FROM employee WHERE CONCAT (first_name," ",last_name) = ?`, answer.manager, (err, data) => {
                                        if (err) {
                                            throw err
                                        } else {
                                            if (answer.manager !== 'none') {
                                                manager = JSON.stringify(data[0].id)
                                            } else {
                                                manager = null
                                            }
                                        }
                                        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [response.firstName, response.lastName, title, manager], (err) => {
                                            if (err) {
                                                throw err
                                            } else {
                                                mainMenu();
                                            }
                                        }
                                        )
                                    })
                                })
                        })
                    }
                }
                )
            })
    })
}

const updateRole = () => {
    db.query(`SELECT * FROM employee`, (err, result) => {
        if (err) throw err
        inquirer.prompt([
            {
                type: "list",
                name: 'employee',
                message: "Please select the employee you wish to change.",
                choices() {
                    const employeeArray = [];
                    result.forEach(({ first_name, last_name }) => {
                        employeeArray.push(`${first_name} ${last_name}`)
                    })
                    return employeeArray;
                }
            },
        ])
            .then(response => {
                db.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name)=?`, response.employee, (err, results) => {
                    if (err) {
                        throw err
                    } else {
                        let employeeID = JSON.stringify(results[0].id)
                        db.query(`SELECT * FROM role`, (err, data) => {
                            if (err) throw err;
                            inquirer.prompt([{
                                type: 'list',
                                name: "roleID",
                                message: "What's the employee's new role?",
                                choices() {
                                    const roleArray = [];
                                    data.forEach(({ title }) => {
                                        roleArray.push(title)
                                    })
                                    return roleArray;
                                }
                            }
                            ])
                                .then(answer => {
                                    db.query(`SELECT id FROM role WHERE title = ?`, answer.roleID, (err, data) => {
                                        if (err) {
                                            throw err
                                        } else {
                                            let roleIdentification = JSON.stringify(data[0].id)
                                        db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [roleIdentification, employeeID], (err) => {
                                        if (err) {
                                            throw err
                                        } else {
                                            viewEmployees();
                                            mainMenu();
                                        }
                                    }
                                    )}
                                    })
                        })
                    })
            }
                }
    )
})
    })

}

const exit = () => {
    console.log('Thanks for using the app')
    process.exit();
}

mainMenu();