const { v4: uuidv4 } = require("uuid");
const TodoModel=require("./todo.model");
const UserModel = require("./user.model");
const { DB } = require("./database");
const { GetTodoApiResponseItemDto } = require("../dtos/get-todos-api.dto");
const db = DB.create();
async function handleTodoCreate(input) {
    // const newId = uuidv4();
    // const todo = new TodoModel(newId, input.title, input.description, input.user_id,new Date());
    const pool=db.pool();
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
module.exports = { handleTodoCreate, getTodos};