const inquirer = require("inquirer");
const Database = require("./db/index");

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
        const employees = new Database();
        console.log(employees.getEmployees());
      break;
    case "View All Roles":
      const roles = new Database();
      console.log(roles.getRoles());
      break;
    case "View All Departments":
      const departments = new Database();
      console.log(departments.getDepartments());
      break;
  }
}

inquirer.prompt(questions).then(handleResponse);
