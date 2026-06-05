const SuperAdminLoginDto = require("../dtos/superadmin-login.dto");
const InviteAdminDto = require("../dtos/invite-admin.dto");
const ChangePasswordDto = require("../dtos/change-password.dto");
const authService = require("../model/auth.service");
const userService = require("../model/user.service");
const adminService = require("../model/admin.service");
const { handleErrors } = require("./handle-errors");
const { sendMail } = require("../model/mail.service");

async function superadminLogin(req, res) {
    try {
        const body = req.body;

        const input = SuperAdminLoginDto.parse(body);

        const token = await adminService.superadminLogin(input);

        return res.json({ data: token, message: "Logined successfully!" });
    } catch (err) {
        handleErrors(res, err);
    }
}

async function inviteAdmin(req, res) {
    try {
        const body = req.body;

        const input =
            InviteAdminDto.parse(body);

        const admin =
            await adminService
                .inviteAdmin(input);

        return res.status(201).json({
            data: admin,
            message:
                "You are invited successfully"
        });

    } catch (err) {
        handleErrors(res, err);
    }
}


async function changePassword(req, res) {
    try {
        const input =
            ChangePasswordDto.parse(
                req.body
            );

        const result =
            await adminService
                .changePassword(
                    input
                );

        return res.json({
            data: result,
            message:
                "Password changed successfully",
        });
    } catch (err) {
        handleErrors(res, err);
    }
}

async function deleteUserController(req, res) {
    try {
        const admin = req.admin; // from auth middleware
        const userId = req.params.userId;


        const result = await userService.deleteUserByAdmin(
            { userId },
            admin
        );

        return res.json({
            data: result,
            message:
                "User deleted successfully"
        });
    } catch (err) {
        handleErrors(res, err);
    }
}

module.exports = { superadminLogin, inviteAdmin, changePassword, deleteUserController };
