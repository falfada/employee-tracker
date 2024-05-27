const inquirer = require("inquirer");
const Database = require("./db/index");
const db = new Database();

const questions = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "options",
    choices: ["View All Employees", "View All Roles", "View All Departments"],
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
  }
  // askQuestions();
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
// Main Questions
function askQuestions() {
  inquirer.prompt(questions).then(handleResponse);
}

askQuestions();
