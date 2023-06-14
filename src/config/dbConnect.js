import { Sequelize } from "sequelize";
import dotEnv from "dotenv";

dotEnv.config();

const sequelize = new Sequelize(
  "todo_list",
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false
  }
);

export default sequelize;
