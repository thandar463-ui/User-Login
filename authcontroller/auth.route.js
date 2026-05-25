const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const userController = require("./user.controller");
const { authMiddleware, } = require("../middlewares/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.delete("/users", authMiddleware, userController.deleteUser);
router.patch("/users", authMiddleware, userController.updateUser);
module.exports = { router };
