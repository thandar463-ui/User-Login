const express = require("express");
const fs = require("fs");
const todoController = require("./authcontroller/todo.controller");
const authController = require("./authcontroller/auth.controller");
const userController = require("./authcontroller/user.controller");
const adminController = require("./authcontroller/admin.controller");
const { router: authRoute } = require("./authcontroller/auth.route");
const { authMiddleware } = require("./middlewares/auth.middleware");
const { adminMiddleware } = require("./middlewares/adminjwt.middleware");
const adminService = require("./model/admin.service");


const { DB } = require("./model/database");
process.loadEnvFile("./.env");
console.log("secret:", process.env.JWT_SECRET);

const PORT = process.env.PORT;
if (PORT === undefined) {
  throw new Error("PORT is not provided");
}
const app = express();
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
app.get("/todos", authMiddleware, todoController.getTodos);
app.post("/todos", authMiddleware, todoController.createTodo);
app.put("/todos/:id", authMiddleware, todoController.updateTodo);
app.delete("/todos/:id", authMiddleware, todoController.deleteTodo);

app.get("/auth/register", authController.getUser);
app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);

app.post("/send-otp", authMiddleware, userController.sendOtp);
app.post("/change-email", authMiddleware, userController.updateEmail);
app.post("/verify-email", userController.verifyEmail);

app.post("/superadminlogin", adminController.superadminLogin);
app.post("/admin", adminController.inviteAdmin);
app.post("/invitelogin", adminController.inviteLogin);
app.post("/change-password", adminController.changePassword);

app.use("/auth", authRoute);


async function start() {
  await adminService.seedSuperAdmin();

}
start();




