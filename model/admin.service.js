const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { DB } = require("./database");
const ApiError = require("../authcontroller/api-error");
const { signJWT } = require("./jwt");
const db = DB.create();

async function seedSuperAdmin() {
    const pool = db.pool();

    const exists = await pool.query(
        `
        SELECT id
        FROM admins
        WHERE role = 'SUPER_ADMIN'
        `
    );

    if (exists.rowCount > 0) {
        return;
    }

    const hashedPassword = await bcrypt.hash(
        process.env.SUPER_ADMIN_PASSWORD,
        10
    );

    await pool.query(
        `
        INSERT INTO admins(
            id,
            name,
            email,
            password,
            role,
            status
        )
        VALUES(
            $1, $2, $3, $4,
            'SUPER_ADMIN',
            'ACTIVE'
        )
         `
        ,
        [
            uuidv4(),
            "Super Admin",
            process.env.SUPER_ADMIN_EMAIL,
            hashedPassword,
        ]
    );
    console.log("Super Admin Created");
}

async function superadminLogin(input) {
    const pool = db.pool();

    const findByEmailResult = await pool.query({
        name: "check-email-duplicate",
        text: "SELECT * FROM admins WHERE email = $1",
        values: [input.email],
    });
    if (findByEmailResult.rows.length < 1) {
        throw new ApiError("Super admin not found", 400);
    }
    const foundAdmin = findByEmailResult.rows[0];
    if (foundAdmin.status !== "ACTIVE") {
        throw new ApiError("Your not Super admin .", 400);
    }

    const isSame = await bcrypt.compare(input.password, foundAdmin.password);
    if (!isSame) {
        throw new ApiError("Password not match", 400);
    }

    const token = signJWT({ id: foundAdmin.id });
    return token;
}

async function inviteAdmin(input) {
    const pool = db.pool();

    const existingAdmin = await pool.query(
        `
        SELECT id
        FROM admins
        WHERE email = $1
        `
        ,
        [input.email]
    );

    if (existingAdmin.rowCount > 0) {
        throw new ApiError(
            "Email already exists",
            400
        );
    }

    // default password
    const defaultPassword = "123456";

    const hashedPassword =
        await bcrypt.hash(
            defaultPassword,
            10
        );

    const result = await pool.query(
        `
        INSERT INTO admins (
            id,
            name,
            email,
            password,
            role,
            status,
            created_at,
            updated_at
        )
        VALUES (
            $1,$2,$3,$4,$5,
            'INVITED',
            NOW(),
            NOW()
        )
        RETURNING
            id,
            name,
            email,
            role,
            status
       `
        ,
        [
            uuidv4(),
            input.name,
            input.email,
            hashedPassword,
            input.role
        ]
    );

    return result.rows[0];
}

async function inviteLogin(input) {
    const pool = db.pool();

    const result =
        await pool.query(
            `
            SELECT *
            FROM admins
            WHERE email = $1
           `
            ,
            [input.email]
        );

    if (result.rowCount === 0) {
        throw new ApiError(
            "Invalid credentials",
            401
        );
    }

    const admin =
        result.rows[0];

    const match =
        await bcrypt.compare(
            input.password,
            admin.password
        );

    if (!match) {
        throw new ApiError(
            "Invalid credentials",
            401
        );
    }

    if (
        admin.status ===
        "INVITED"
    ) {
        await pool.query(
            `
            UPDATE admins
            SET
                status = 'ACTIVE',
                updated_at = NOW()
            WHERE id = $1
            `
            ,
            [admin.id]
        );

        admin.status =
            "ACTIVE";
    }

    const token = signJWT({
        id: admin.id,
        role: admin.role,
    });

    return {
        accessToken: token,
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            status:
                admin.status,
        },
    };
}

async function changePassword(input) {
    const pool = db.pool();

    const result =
        await pool.query(
            `
            SELECT *
            FROM admins
            WHERE email = $1
           `
            ,
            [input.email]
        );

    if (result.rowCount === 0) {
        throw new ApiError(
            "Admin not found",
            404
        );
    }

    const admin =
        result.rows[0];

    const isMatch =
        await bcrypt.compare(
            input.oldPassword,
            admin.password
        );

    if (!isMatch) {
        throw new ApiError(
            "Old password is incorrect",
            400
        );
    }

    const passwordHash =
        await bcrypt.hash(
            input.newPassword,
            10
        );

    await pool.query(
        `
        UPDATE admins
        SET
            password = $1,
            updated_at = NOW()
        WHERE id = $2
        `
        ,
        [
            passwordHash,
            admin.id,
        ]
    );

    return {
        success: true,
    };
}

module.exports = {
    seedSuperAdmin,
    superadminLogin,
    inviteAdmin,
    inviteLogin,
    changePassword
};
