const { DB } = require("./database");
const OtpModel = require("./otp.model");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../authcontroller/api-error");
const { raw } = require("express");
const db = DB.create();

async function createOtp(email, user_id) {
    const pool = db.pool();
    const otp = new OtpModel(uuidv4(), uuidv4(), email, user_id, new Date());
    await pool.query({
        name: "create-otp",
        text: "INSERT INTO otps VALUES ($1, $2, $3, $4, $5) RETURNING *",
        values: [otp.id, otp.code, otp.email, otp.user_id, otp.createdAt],
    });
    return otp;
}

async function findOtp(code) {
    const pool = db.pool();
    console.log(code);
    const findOtpResult = await pool.query({
        name: "find-otp",
        text: "SELECT * FROM otps WHERE code = $1 ",
        values: [code],
    });
    if (!findOtpResult.rows.length) {
        throw new ApiError("Otp not found", 400);
    }
    const rawOtp = findOtpResult.rows[0];
    const otp = new OtpModel(
        rawOtp.id,
        rawOtp.code,
        rawOtp.email,
        rawOtp.user_id,
        rawOtp.createdAt,
    );
    return otp;

}

async function activateUser(id) {
    const pool = db.pool();
    await pool.query({
        name: "activate-user",
        text: "UPDATE users SET status = 'active' WHERE id = $1 AND status = 'pending'",
        values: [id],
    })

}

async function updateEmail(user_id, email) {
    const pool = db.pool();
    await pool.query({
        name: "update-email",
        text: "UPDATE users SET email = $1 WHERE id = $2",
        values: [email, user_id],
    });
    return;
}

async function deleteOtp(id) {
    const pool = db.pool();
    await pool.query({
        name: "delete-otp",
        text: "DELETE from otps WHERE id =$1",
        values: [id],
    });
    return;
}

async function deleteUserByAdmin(input, currentAdmin) {
    const pool = db.pool();
    if (currentAdmin.role !== "SUPER_ADMIN" && currentAdmin.role !== "ADMIN") {
        throw new ApiError("Permission denied", 400);
    }
    const userResult = await pool.query(
        `
        SELECT id, deleted
        FROM users
        WHERE id = $1
        `,
        [input.userId]
    );

    if (userResult.rowCount === 0) {
        throw new ApiError("User not found", 404);
    }

    const user = userResult.rows[0];
    if (user.deleted === true) {
        throw new ApiError("User is already deleted", 400);
    }


    const result = await pool.query(
        `
        UPDATE users
        SET deleted = true
        WHERE id = $1
        RETURNING id, name, email, deleted, status
        `,
        [input.userId]
    );

    return {
        message: "User deleted successfully",
        user: result.rows[0],
    };
}



module.exports = {
    createOtp, findOtp, activateUser, updateEmail, deleteOtp,
    deleteUserByAdmin,
};