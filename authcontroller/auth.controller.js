const RegisterDto = require("../dtos/register-api.dto");
const LoginDto = require("../dtos/login.dto");
const RefreshTokenDto = require("../dtos/refresh-token.dto");
const authService = require("../model/auth.service");
const userService = require("../model/user.service");
const { handleErrors } = require("./handle-errors");
const { sendMail } = require("../model/mail.service");

async function register(req, res) {
  try {
    const body = req.body;

    const input = RegisterDto.parse(body);

    const createdUser = await authService.register(input);
    const otp = await userService.createOtp(createdUser.email, createdUser.id);
    sendMail({
      email: createdUser.email,
      code: otp.code,
    });

    return res.status(201).json({
      dataid: { id: createdUser.id },

      message: "Account created . Please verify email.",
    });

  } catch (err) {
    handleErrors(res, err);
  }
}

async function getUser(req, res) {
  try {
    const user = await authService.getUser();
    return res.status(200).json({ data: user });

  } catch (err) {
    handleErrors(res, err);
  }
}
// async function login(req, res) {

//     try {

//         const body = req.body;

//         // validation
//         const input =
//             LoginDto.parse(body);

//         const user =
//             await authService.login(
//                 input
//             );

//         return res.status(200).json({
//             message: "Login success",
//             data: user,
//         });

//     } catch (err) {
// handleErrors(res, err);
//     }


// }

async function login(req, res) {
  try {
    const body = req.body;

    const input = LoginDto.parse(body);

    const token = await authService.login(input);

    return res.json({ data: token, message: "Logined successfully!" });
  } catch (err) {
    handleErrors(res, err);
  }
}

async function getMe(req, res) {

  try {

    console.log(
      "Retrieved userId from middleware:",
      req.userId
    );

    const user =
      await authService.getMe(
        req.userId
      );

    return res.status(200).json({
      message:
        "Get user successfully",

      data: {
        id: user.id,
        name: user.name,
        createdAt:
          user.created_at,
      },
    });

  } catch (err) {

    handleErrors(res, err);
  }
}

async function deleteUser(req, res) {
  try {
    const deletedUser = await authService.deleteUser(req.userId);
    return res.status(200).json({ message: "User deleted successfully", data: { id: deletedUser.id, isDeleted: deletedUser.is_deleted, }, });
  } catch (err) {
    handleErrors(res, err);
  }
}
async function getRefreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    const data = await authService.getRefreshToken(refreshToken);

    return res.status(200).json({
      data,
      message: "Access token generated successfully",
    });
  } catch (err) {
    handleErrors(res, err);
  }
}

module.exports = { register, getUser, login, getMe, deleteUser, getRefreshToken };
