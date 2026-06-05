const { DB } = require("../model/database");
const { verifyJWT } = require("../model/jwt");
const ApiError = require("../authcontroller/api-error");

const db = DB.create();

async function permissionMiddleware(req, res, next) {
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

        const findAdminByIdResult = await pool.query({
            name: "find-admin-by-id",
            text: "SELECT * FROM admins WHERE id = $1",
            values: [payload.id],
        });

        if (findAdminByIdResult.rows.length === 0) {
            throw new ApiError("Invalid jwt token", 401);
        }


        const admin = findAdminByIdResult.rows[0];
        if (admin.role !== "SUPER_ADMIN" && admin.role !== "ADMIN") {
            throw new ApiError("Permission denied", 400);
        }
        req.admin = admin;

        next();
    } catch (err) {
        if (err instanceof ApiError) {
            return res.status(err.statusCode).json({ message: err.message });
        }

        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { permissionMiddleware };
