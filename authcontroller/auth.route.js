const express = require("express");
const router = express.Router();
const todoController = require("./todo.controller");
const authController = require("./auth.controller");
const userController = require("./user.controller");
const adminController = require("./admin.controller");
const { authMiddleware, } = require("../middlewares/auth.middleware");
const { adminMiddleware, } = require("../middlewares/adminjwt.middleware");
const { permissionMiddleware, } = require("../middlewares/permission.middleware");

router.get("/todos", authMiddleware, todoController.getTodos);
router.post("/todos", authMiddleware, todoController.createTodo);
router.put("/todos/:id", authMiddleware, todoController.updateTodo);
router.delete("/todos/:id", authMiddleware, todoController.deleteTodo);


router.get("/register", authController.getUser);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.delete("/users", authMiddleware, userController.deleteUser);
router.patch("/users", authMiddleware, userController.updateUser);

router.post("/send-otp", authMiddleware, userController.sendOtp);
router.post("/change-email", authMiddleware, userController.updateEmail);
router.post("/verify-email", userController.verifyEmail);

router.post("/invitelogin", adminController.Login);
router.post("/invite", adminController.invite);
router.post("/change-password", adminController.changePassword);
router.delete("/user/:userId", adminMiddleware, permissionMiddleware, adminController.deleteUserController);


module.exports = { router };
