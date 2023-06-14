import express from "express";
import dotEnv from "dotenv";
import sequelize from "./src/config/dbConnect.js";
import { User, Task } from "./src/models/index.js";
import routes from "./src/routes/index.js";
import cookieParser from "cookie-parser";

dotEnv.config();

const app = express();
const port = process.env.PORT || 3000;
const host = "0.0.0.0";

app.use(express.json());
app.use(cookieParser());
routes(app);

await sequelize
  .sync()
  .then(() => {
    User.sync();
    Task.sync();
    console.log("DB rodando");
  })
  .catch((error) => {
    console.error("Unable to synchronize models with the database:", error);
  });

app.listen(port, host, () => {
  console.log(`SERVIDOR FUNCIONANDO EM http://localhost:${port}`);
});
export default app;
