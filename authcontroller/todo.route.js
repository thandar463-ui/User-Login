const express = require("express");
const router = express.Router();
const todoController = require("./todo.controller");
const { authMiddleware, } = require("../middlewares/auth.middleware");


router.get("/todo", authMiddleware, todoController.getTodos);
router.post("/todo", authMiddleware, todoController.createTodo);
router.put("/todo/:id", authMiddleware, todoController.updateTodo);
router.delete("/todo/:id", authMiddleware, todoController.deleteTodo);


module.exports = { router };
