const z = require("zod");

const InviteDto = z.object({
    name: z.string(),
    email: z.email(),
    role: z.enum([
        "ADMIN",
        "MANAGER"
    ])
});

module.exports = InviteDto;