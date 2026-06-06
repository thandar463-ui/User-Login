const express = require("express");
const router = express.Router();
const adminController = require("./admin.controller");
const { adminMiddleware, } = require("../middlewares/adminjwt.middleware");
const { permissionMiddleware, } = require("../middlewares/permission.middleware");

router.post("/invitelogin", adminController.Login);
router.post("/invite", adminController.invite);
router.post("/change-password", adminController.changePassword);
router.delete("/user/:userId", adminMiddleware, permissionMiddleware, adminController.deleteUserController);


module.exports = { router };
