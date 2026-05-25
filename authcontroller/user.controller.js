const EditDto = require("../dtos/update.dto");
const authService = require("../model/auth.service");
const { handleErrors } = require("./handle-errors");


async function deleteUser (req,res) {
  try {
    const deletedUser = await authService.deleteUser(req.userId);
    return res.status(200).json({message: "User deleted successfully", data: {id: deletedUser.id, isDeleted: deletedUser.is_deleted,},});
  }catch (err) {
    handleErrors(res,err);
  }
}

async function updateUser (req,res) {
  try {
    const body = req.body;
const input = EditDto.parse(body);
    const updateUser = await authService.updateUser(req.userId,input);
    return res.status(200).json({message: "User updated successfully", data: {id: updateUser.id, name: updateUser.name,},});
  }catch (err) {
    handleErrors(res,err);
  }
}

module.exports = {deleteUser,updateUser};
