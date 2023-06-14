import User from "./User.js";
import Task from "./Task.js";

User.hasMany(Task, { onDelete: "CASCADE" });

Task.belongsTo(User);

export { User, Task };
