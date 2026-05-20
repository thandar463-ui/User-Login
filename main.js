const express = require("express");
const fs = require("fs");
const authController = require("./authcontroller/auth.controller");
const { DB } = require("./model/database");
const PORT = 4000;
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




