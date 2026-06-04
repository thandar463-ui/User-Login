const z = require("zod");

const InviteAdminDto = z.object({
    name: z.string(),
    email: z.email(),
    role: z.enum([
        "ADMIN",
        "MANAGER"
    ])
});

module.exports = InviteAdminDto;