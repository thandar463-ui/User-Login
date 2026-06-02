const CreateTodoDto=require("../dtos/create-todo.dto");
const GetTodoApiResponseItemDto=require("../dtos/get-todos-api.dto");
const authService = require("../model/auth.service");
const userService = require("../model/user.service");
const todoService = require("../model/todo.service");
const { sendMail } = require("../model/mail.service");
const { handleErrors } = require("./handle-errors");
async function createTodo(req, res) {
    try{
        const body = req.body;
        const input = CreateTodoDto.parse(body);
        const userId = req.user.id;
console.log("Id:",userId);
    const createdTodo = await todoService.handleTodoCreate({
       title: input.title,
       description: input.description,
        userId,
    } );

        return res.status(201).json({data: createdTodo});
    }catch (err) {
        handleErrors(res,err);
    }
}

async function getTodos(req, res){
    try {
        const userId = req.user.id;
        const todos = await todoService.getTodos(userId);
        return res.status(200).json({data: todos});

    }catch (err) {
        handleErrors(res,err);
    }
}
module.exports = {
    createTodo,
    getTodos,
};