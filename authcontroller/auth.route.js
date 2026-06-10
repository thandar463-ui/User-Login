const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");
const userController = require("./user.controller");

const { authMiddleware, } = require("../middlewares/auth.middleware");

router.get("/register", authController.getUser);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.delete("/users", authMiddleware, userController.deleteUser);
router.patch("/users", authMiddleware, userController.updateUser);
router.post("/refresh", authController.refreshAccessToken);

router.post("/send-otp", authMiddleware, userController.sendOtp);
router.post("/change-email", authMiddleware, userController.updateEmail);
router.post("/verify-email", userController.verifyEmail);




module.exports = { router };
