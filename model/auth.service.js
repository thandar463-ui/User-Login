const { DB } =require("./database");
const UserModel = require("./user.model");
const bcrypt = require("bcrypt");
const { v4 : uuidv4 } = require("uuid");
const { GetUserApiResponseItemDto } = require("../dtos/get-user-api.dto");
const ApiError = require("../authcontroller/api-error");
const { signJWT } = require("./jwt");
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

  const findByEmailResult = await pool.query({
    name: "check-email-duplicate",
    text: "SELECT * FROM users WHERE email = $1",
    values: [input.email],
  });
  if (findByEmailResult.rows.length < 1) {
    throw new ApiError("User not found", 400);
  }
  const foundUser = findByEmailResult.rows[0];

  const isSame = await bcrypt.compare(input.password, foundUser.password);
  if (!isSame) {
    throw new ApiError("Password not match", 400);
  }

  const token = signJWT({ id: foundUser.id });
  return token;
}

async function getMe(userId) {

  const pool = db.pool();

  const queryResult =
    await pool.query({
      name: "find-user-by-id-service",
      text:
        "SELECT id, name, created_at FROM users WHERE id = $1",
      values: [userId],
    });

  if (queryResult.rows.length === 0) {
    throw new ApiError("User not found", 400);
  }

  return queryResult.rows[0];
}


module.exports = { register,getUser,login ,getMe};