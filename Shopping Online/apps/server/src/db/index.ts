
import mysql2 from "mysql2/promise"

console.log("In DB connection module");

const {
  MYSQL_DB_HOST: host,
  MYSQL_DB_PORT: port,
  MYSQL_DB_USER: user,
  MYSQL_DB_PASS: password,
  MYSQL_DB_SCHEMA: database,
} = process.env;

let connection: mysql2.Connection | null = null;

async function exeMySqlDB():Promise<void> {
  console.log("Database initilization Start");
  try {
    connection = await mysql2.createConnection({
      host,
      port: Number(port),
      user,
      password,
      database,
    });
  } catch (error: unknown) {
    console.log(error);
    console.log("Application shut down due to MySQL connection error");
    process.exit(1);
  }
};

function getConnection(): mysql2.Connection | any {
  return connection;
};

export { exeMySqlDB, getConnection };
