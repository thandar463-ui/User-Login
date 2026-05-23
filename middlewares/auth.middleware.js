const { DB } = require("../model/database");
const { verifyJWT } = require("../model/jwt");
const ApiError = require("../authcontroller/api-error");

const db = DB.create();

async function authMiddleware(req, res, next) {
  try {
    const pool = db.pool();

    const authorizationHeader = req.headers?.authorization;
    if (!authorizationHeader) {
      throw new ApiError("Authorization header must be provided", 401);
      
    }
    const splittedAuthHeader = authorizationHeader.split(" ");
    if (splittedAuthHeader.length !== 2) {
      throw new ApiError("Invalid authorization header", 401);
    }
    if (splittedAuthHeader[0] !== "JWT") {
      throw new ApiError("Invalid authorization header", 401);
    }
    const jwtToken = splittedAuthHeader[1];

    const payload = verifyJWT(jwtToken);
    if (!("id" in payload) || payload.id === "") {
      throw new ApiError("Invalid jwt token", 401);
    }

    const findUserByIdResult = await pool.query({
      name: "find-user-by-id",
      text: "SELECT * FROM users WHERE id = $1",
      values: [payload.id],
    });
    if (findUserByIdResult.rows.length === 0) {
      throw new ApiError("Invalid jwt token", 401);
    }

    req.userId=payload.id;
    console.log("Middleware uerid :",req.userId);

    next();
  } catch (err) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { authMiddleware };
