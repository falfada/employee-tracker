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

  // Query to return managers
  async getManagers() {
    const query = "SELECT * FROM employee WHERE manager_id IS NULL";
    return await this.executeQuery(query, "employee");
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
    // Getting department ID
    const department = await client.query(
      `SELECT id FROM department WHERE name = '${role.newRoleDepartment}'`
    );
    const departmentId = department.rows[0].id;
    await client.query(
      `INSERT INTO role (title, salary, department_id) VALUES ('${role.newRole}', '${role.newRoleSalary}', ${departmentId})`
    );
    client.release();
  }

  // Add New Employee
  async addEmployee(employee) {
    const client = await this.pool.connect();
    // Getting role ID
    const role = await client.query(
      `SELECT id FROM role WHERE title = '${employee.newEmployeeRole}'`
    );
    const roleId = role.rows[0].id;
    // Getting manager ID
    const managerFullName = employee.newEmployeeManager;
    const managerSplit = managerFullName.split(" ");
    const managerName = managerSplit[0];
    const managerLastName = managerSplit[1];
    const manager = await client.query(
      `SELECT id FROM employee WHERE first_name = '${managerName}' AND last_name = '${managerLastName}'`
    );
    const managerId = manager.rows[0].id;
    await client.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employee.newEmployeeName}', '${employee.newEmployeeLastName}', ${roleId}, ${managerId})`
    );
    client.release();
  }

  // Update employee
  async updateEmployee(employee) {
    const client = await this.pool.connect();
    // Get employee full name
    const employeeFullName = employee.updateEmployee.split(" ");
    // Get the role ID
    const roleQuery = {
      text: "SELECT id FROM role WHERE title = $1",
      values: [employee.updateRole],
    };
    const roleResult = await client.query(roleQuery);

    const roleId = roleResult.rows[0].id;
      // Update employee role using parameterized query
      const updateQuery = {
        text: "UPDATE employee SET role_id = $1 WHERE first_name = $2 AND last_name = $3",
        values: [roleId, employeeFullName[0], employeeFullName[1]],
      };
      await client.query(updateQuery);
   

    client.release();
  }
}

module.exports = Database;
