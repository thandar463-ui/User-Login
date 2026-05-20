const z = require("zod");
const RegisterDto = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6).max(20),

});
module.exports = RegisterDto;