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

module.exports = {register, getUser,login,getMe};
