const { v4: uuidv4 } = require("uuid");
const TodoModel = require("./todo.model");
const UserModel = require("./user.model");
const { DB } = require("./database");
const { GetTodoApiResponseItemDto } = require("../dtos/get-todos-api.dto");
const db = DB.create();
const ApiError = require("../authcontroller/api-error");

async function handleTodoCreate(input) {
    // const newId = uuidv4();
    // const todo = new TodoModel(newId, input.title, input.description, input.user_id,new Date());
    const pool = db.pool();
    const result = await pool.query(
        "INSERT INTO todos (id, title, description, user_id,created_at)VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
            uuidv4(),
            input.title,
            input.description,
            input.userId,
            new Date(),


        ]);
    return result.rows[0];
}

async function getTodos(userId) {
    const pool = db.pool();
    const findqueryResult = await pool.query({
        name: "find-result",
        text: "SELECT *, COUNT(*) OVER() AS total_count FROM todos WHERE user_id = $1 ",
        values: [userId],
    });

    return findqueryResult.rows;

}

async function updateTodo(todoId, userId, input) {
    const pool = db.pool();
    console.log("Todo", todoId);
    console.log("User", userId);
    const findResult = await pool.query({
        name: "find-todo",
        text: "SELECT * FROM todos WHERE id = $1 AND user_id = $2 ",
        values: [todoId, userId],
    });

    if (findResult.rows.length === 0) {
        throw new ApiError("Todo not found", 404);
    }

    const updateResult = await pool.query({
        name: "update-todo",
        text: "UPDATE todos SET title = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING * ",
        values: [input.title, input.description, todoId, userId],
    });
    return updateResult.rows[0];
}

async function deleteTodo(todoId, userId) {
    const pool = db.pool();

    const result = await pool.query({
        name: "delete-todo",
        text: "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING * ",
        values: [todoId, userId],
    });

    if (result.rows.length === 0) {
        throw new ApiError("Todo not found", 404);
    }

    return true;
}

module.exports = { handleTodoCreate, getTodos, updateTodo, deleteTodo };