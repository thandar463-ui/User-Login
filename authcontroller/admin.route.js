const express = require("express");
const router = express.Router();
const adminController = require("./admin.controller");
const { adminMiddleware, } = require("../middlewares/adminjwt.middleware");
const { permissionMiddleware, } = require("../middlewares/permission.middleware");
const role = require("../model/role.model")
router.post("/login", adminController.Login);
router.post("/invite", adminController.invite);
router.post("/change-password", adminController.changePassword);
router.delete("/user/:userId", adminMiddleware, permissionMiddleware([role.SUPER_ADMIN, role.ADMIN]), adminController.deleteUserController);
router.get("/users", adminMiddleware, adminController.getUserList);

module.exports = { router };
