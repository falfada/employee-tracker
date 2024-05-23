const { Pool } = require("pg");

class Database {
  constructor() {
    this.pool = new Pool({
      user: "postgres",
      password: "12345",
      host: "localhost",
      database: "employee_db",
    });
  }

  async executeQuery(query, table) {
    try {
      const client = await this.pool.connect();
      const result = await this.pool.query(query);
      client.release();
      console.log(result.rows);
    } catch (error) {
      console.log(`Error fetching ${table}:`, error);
    }
  }
  // Display department table
  getDepartments() {
    const query = `SELECT * FROM department`;
    this.executeQuery(query, "department");
  }

  // Display roles table
  getRoles() {
    const query = `SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id`;
    this.executeQuery(query, "role");
  }

  // Display employees table
  getEmployees() {
    const query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    INNER JOIN role r ON e.role_id = r.id
    INNER JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id`;
    this.executeQuery(query, "employee");
  }
}

module.exports = Database;
