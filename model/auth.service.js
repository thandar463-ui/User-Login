const { DB } =require("./database");
const UserModel = require("./user.model");
const bcrypt = require("bcrypt");
const { v4 : uuidv4 } = require("uuid");
const { GetUserApiResponseItemDto } = require("../dtos/get-user-api.dto");
const ApiError = require("../authcontroller/api-error");
const db = DB.create();
async function register(input) {
    const pool = db.pool();
    const findByEmailResult = await pool.query({
        name: "check-email-duplicate",
        text: "SELECT * FROM users WHERE email = $1",
        values: [input.email],
    });
    if (findByEmailResult.rows.length > 0){
        throw new ApiError("Duplicate email", 400);
    }
    const hashedPassword = await bcrypt.hash(
        input.password,
        await bcrypt.genSalt(10),
    );
    const user = new UserModel(
        uuidv4(),
        input.name,
        input.email,
        hashedPassword,
        new Date(),
    );
    await pool.query({
        name: "create-user",
        text: "INSERT INTO users VALUES ($1, $2, $3, $4, $5) RETURNING *",
        values: [user.id, user.name, user.email, user.password, user.createdAt],
    });
    return user;
}
    async function getUser() {
    const pool = db.pool();
    const queryResult=await pool.query("SELECT * FROM users ");
    const rows = queryResult.rows;
    return rows.map(
        (row) =>
           new GetUserApiResponseItemDto(
            row.id,
            row.name,
            row.email,
            row.password,
            row.created_at,
           ) 
    );
}
async function login(input) {

    const pool = db.pool();

    const findUserResult =
        await pool.query({
            name: "find-user-by-email",
             text: "SELECT * FROM users WHERE email = $1",
            values: [input.email],
        });

    const existingUser =
        findUserResult.rows[0];

    if (!existingUser) {
        throw new ApiError(
            "Invalid email or password",
            400
        );
    }

    const isCorrect =
        await bcrypt.compare(
            input.password,
            existingUser.password
        );

    if (!isCorrect) {
        throw new ApiError(
            "Invalid email or password",
            400
        );
    }

    return {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        password: existingUser.password,
    };
}

module.exports = { register,getUser,login };