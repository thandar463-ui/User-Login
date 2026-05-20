const z = require("zod");

const LoginDto = z.object({

    email: z.email(),

    password: z.string().min(6),

});

module.exports = LoginDto;