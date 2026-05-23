const express = require("express");
const fs = require("fs");
const authController = require("./authcontroller/auth.controller");
const { router: authRoute } = require("./authcontroller/auth.route");
const { authMiddleware } = require("./middlewares/auth.middleware");

const { DB } = require("./model/database");
process.loadEnvFile("./.env");
console.log("secret:", process.env.JWT_SECRET);

const PORT = process.env.PORT;
if (PORT === undefined) {
  throw new Error("PORT is not provided");
}
const app =express();
const db = DB.create();
db.connect({
    host: "localhost",
    user: "postgres",
    password: "pwd",
    database: "user_db",
    port: 5432,
});

app.use(express.json());

app.listen(PORT, () =>{
   console.log(`✅ TODO server running at http://localhost:${PORT}`);

});

app.get("/auth/register", authController.getUser);
app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);
app.use("/auth", authRoute);




