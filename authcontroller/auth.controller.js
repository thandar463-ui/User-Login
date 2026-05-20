const RegisterDto = require("../dtos/register-api.dto");
const LoginDto = require("../dtos/login.dto");
const authService = require("../model/auth.service");
const { handleErrors } = require("./handle-errors");

async function register(req, res) {
  try {
    const body = req.body;

    const input = RegisterDto.parse(body);

    const createdUser = await authService.register(input);

    return res.status(201).json({
      data: { id: createdUser.id },
      message: "User created successfully",
    });
  } catch (err) {
    handleErrors(res, err);
  }
}
async function getUser(req, res){
    try {
        const user = await authService.getUser();
        return res.status(200).json({data: user});

    }catch (err) {
       handleErrors(res, err);handleErrors(res, err);
    }


}
async function login(req, res) {

    try {

        const body = req.body;

        // validation
        const input =
            LoginDto.parse(body);

        const user =
            await authService.login(
                input
            );

        return res.status(200).json({
            message: "Login success",
            data: user,
        });

    } catch (err) {
handleErrors(res, err);handleErrors(res, err);
    }

       
}
module.exports = {register, getUser,login};