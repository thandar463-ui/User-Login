const express = require("express");
const fs = require("fs");
const { router: authRoute } = require("./authcontroller/auth.route");
const { router: adminRoute } = require("./authcontroller/admin.route");
const { router: todoRoute } = require("./authcontroller/todo.route");
const adminService = require("./model/admin.service");
const { DB } = require("./model/database");
const app = express();

process.loadEnvFile("./.env");
console.log("secret:", process.env.JWT_SECRET);

const PORT = process.env.PORT;
if (PORT === undefined) {
  throw new Error("PORT is not provided");
}


const db = DB.create();
db.connect({
  host: "localhost",
  user: "postgres",
  password: "pwd",
  database: "todo_db",
  port: 5432,
});

app.use(express.json());

app.listen(PORT, () => {
  console.log(`✅ TODO server running at http://localhost:${PORT}`);

});

app.use("/auth", authRoute);
app.use("/admin", adminRoute);
app.use("/todos", todoRoute);


async function start() {
  await adminService.seedSuperAdmin();

}
start();




