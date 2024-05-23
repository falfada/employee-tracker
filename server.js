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

async function handleResponse(data) {
  const db = new Database();
  switch (data.options) {
    case "View All Employees":
      await db.getEmployees();
      break;
    case "View All Roles":
      await db.getRoles();
      break;
    case "View All Departments":
      await db.getDepartments();
      break;
  }
  askQuestions();
}

function askQuestions() {
  inquirer.prompt(questions).then(handleResponse);
}
askQuestions();
