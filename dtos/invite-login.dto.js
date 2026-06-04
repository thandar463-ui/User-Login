const z = require("zod");

const InviteLoginDto = z.object({

    email: z.email(),

    password: z.string().min(6),


});

module.exports = InviteLoginDto;