const EditDto = require("../dtos/update.dto");
const RegisterDto = require("../dtos/register-api.dto");
const UpdateEmailDto = require("../dtos/update-email.dto");
const SendOtpDto = require("../dtos/send-otp.dto");
const VerifyEmailDto = require("../dtos/verify-email.dto");
const userService = require("../model/user.service");
const authService = require("../model/auth.service");
const { handleErrors } = require("./handle-errors");
const { sendMail } = require("../model/mail.service");

async function deleteUser(req, res) {
  try {
    const deletedUser = await authService.deleteUser(req.userId);
    return res.status(200).json({ message: "User deleted successfully", data: { id: deletedUser.id, isDeleted: deletedUser.is_deleted, }, });
  } catch (err) {
    handleErrors(res, err);
  }
}

async function updateUser(req, res) {
  try {
    const body = req.body;
    const input = EditDto.parse(body);
    const updateUser = await authService.updateUser(req.userId, input);
    return res.status(200).json({ message: "User updated successfully", data: { id: updateUser.id, name: updateUser.name, }, });
  } catch (err) {
    handleErrors(res, err);
  }
}



async function sendOtp(req, res) {
  try {
    const body = req.body;
    const input = SendOtpDto.parse(body);
    const otp = await userService.createOtp(input.email, req.user.id);
    sendMail({ email: input.email, code: otp.code });
    return res.status(201).json({
      data: {},
      message: "Otp successfully send to email",
    });
  } catch (err) {
    handleErrors(res, err);
  }
}

async function verifyEmail(req, res) {

  try {

    const body = req.body;

    const input = VerifyEmailDto.parse(body);

    const foundOtp = await userService.findOtp(
      input.code);

    await userService.activateUser(
      foundOtp.user_id
    );

    await userService.deleteOtp(
      foundOtp.id
    );

    return res.status(200).json({
      data: {},
      message:
        "Email verified successfully",
    });

  } catch (err) {
    handleErrors(res, err);
  }
}

async function updateEmail(req, res) {
  try {
    const body = req.body;
    const input = UpdateEmailDto.parse(body);
    const foundOtp = await userService.findOtp(input.code, req.user.id);
    await userService.updateEmail(req.user.id, foundOtp.email);
    await userService.deleteOtp(foundOtp.id);
    return res.status(201).json({
      data: {}, message: "Email successfully updated",

    });
  } catch (err) {
    handleErrors(res, err);
  }
}

module.exports = { deleteUser, updateUser, sendOtp, verifyEmail, updateEmail };
