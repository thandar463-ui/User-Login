const z = require("zod");

const ChangePasswordDto = z.object({
    email: z.email(),
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
});

module.exports = ChangePasswordDto;