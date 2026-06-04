const z = require("zod");

const SuperAdminLoginDto = z.object({

    email: z.email(),

    password: z.string().min(6),


});

module.exports = SuperAdminLoginDto;