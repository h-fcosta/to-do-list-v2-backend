import sequelize from "../config/dbConnect.js";
import Task from "./Task.js";
import { DataTypes } from "sequelize";
import { v4 as uuid4 } from "uuid";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuid4(),
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default User;
