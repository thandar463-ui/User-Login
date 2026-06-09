const LoginDto = require("../dtos/login.dto");
const GetUserDto = require("../dtos/get-users.dto");
const InviteDto = require("../dtos/invite.dto");
const ChangePasswordDto = require("../dtos/change-password.dto");
const authService = require("../model/auth.service");
const userService = require("../model/user.service");
const adminService = require("../model/admin.service");
const { handleErrors } = require("./handle-errors");
const { sendMail } = require("../model/mail.service");

async function Login(req, res) {
    try {
        const body = req.body;

        const input = LoginDto.parse(body);

        const token = await adminService.Login(input);

        return res.json({ data: token, message: "Logined successfully!" });
    } catch (err) {
        handleErrors(res, err);
    }
}

async function invite(req, res) {
    try {
        const body = req.body;

        const input =
            InviteDto.parse(body);

        const admin =
            await adminService
                .invite(input);

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

async function getUserList(req, res) {
    try {
        const admin = req.admin;
        const query = GetUserDto.parse(req.query);
        const users = await adminService.getUserList(
            admin,
            query.page,
            query.size

        );

        return res.json({ data: users, message: "Users fetched successfully" });
    } catch (err) {
        handleErrors(res, err);
    }
}


module.exports = { Login, invite, changePassword, deleteUserController, getUserList };
