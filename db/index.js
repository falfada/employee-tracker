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
      const result = await client.query(query);
      client.release();
      return result.rows;
    } catch (error) {
      console.log(`Error fetching ${table}:`, error);
      throw error;
    }
  }
  // Query to return departments
  async getDepartments() {
    const query = `SELECT * FROM department`;
    return await this.executeQuery(query, "department");
  }
  // Query to return roles
  async getRoles() {
    const query = `SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id = department.id`;
    return await this.executeQuery(query, "role");
  }

  // Query to return employees
  async getEmployees() {
    const query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    INNER JOIN role r ON e.role_id = r.id
    INNER JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id`;
    return await this.executeQuery(query, "employee");
  }
  // Add New Department
  async addDepartment(department) {
    const client = await this.pool.connect();
    const result = await client.query(
      `INSERT INTO department (name) VALUES ('${department}')`
    );
    client.release();
  }
  // Add New Role
  async addRole(role) {
    const client = await this.pool.connect();
    const department = await client.query(
      `SELECT id FROM department WHERE name = '${role.newRoleDepartment}'`
    );
    const departmentId = department.rows[0].id;
    await client.query(
      `INSERT INTO role (title, salary, department_id) VALUES ('${role.newRole}', '${role.newRoleSalary}', ${departmentId})`
    );
    client.release();
  }
}

module.exports = Database;
