const inquirer = require("inquirer");
const Database = require("./db/index");
const db = new Database();

const questions = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "options",
    choices: [
      "View All Employees",
      "View All Roles",
      "View All Departments",
      "Add Department",
      "Add Role",
      "Add Employee",
    ],
  },
];

function handleResponse(data) {
  switch (data.options) {
    case "View All Employees":
      viewEmployees();
      break;
    case "View All Roles":
      viewRoles();
      break;
    case "View All Departments":
      viewDepartments();
      break;
    case "Add Department":
      addDepartment();
      break;
    case "Add Role":
      addRole();
      break;
    case "Add Employee":
      addEmployee();
      break;
  }
}

// Display Employees Table
function viewEmployees() {
  db.getEmployees()
    .then((employee) => console.table(employee))
    .then(() => askQuestions());
}
// Display Roles Table
function viewRoles() {
  db.getRoles()
    .then((roles) => console.table(roles))
    .then(() => askQuestions());
}
// Display Departments Table
function viewDepartments() {
  db.getDepartments()
    .then((departments) => console.table(departments))
    .then(() => askQuestions());
}

// Add Department
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      message: "What is the name of the department?",
      name: "newDepartmentName",
    })
    .then((data) => {
      db.addDepartment(data.newDepartmentName);
      console.log(`Added ${data.newDepartmentName} to the database`);
    })
    .then(() => askQuestions());
}

// Add Role
async function addRole() {
  const departments = await db.getDepartments();
  const currentDepartments = departments.map((item) => item.name);

  await inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the role?",
        name: "newRole",
      },
      {
        type: "input",
        message: "What is the salary of the role?",
        name: "newRoleSalary",
      },
      {
        type: "list",
        message: "Which department does the role belongs to?",
        name: "newRoleDepartment",
        choices: currentDepartments,
      },
    ])
    .then((data) => {
      db.addRole(data);
      console.log(`Added ${data.newRole} to the database`);
    })
    .then(() => askQuestions());
}
// Add Employee
async function addEmployee() {
  const roles = await db.getRoles();
  const currentRoles = roles.map((item) => item.title);
  const managers = await db.getManagers();
  const currentManagers = managers.map(
    (item) => `${item.first_name} ${item.last_name}`
  );
  await inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "newEmployeeName",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "newEmployeeLastName",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "newEmployeeRole",
        choices: currentRoles,
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        name: "newEmployeeManager",
        choices: currentManagers,
      },
    ])
    .then((data) => {
      db.addEmployee(data);
      console.log(
        `Added ${data.newEmployeeName} ${data.newEmployeeLastName} to the database`
      );
    })
    .then(() => askQuestions());
}
// Main Questions
function askQuestions() {
  inquirer.prompt(questions).then(handleResponse);
}

askQuestions();
