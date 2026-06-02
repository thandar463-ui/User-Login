const z = require("zod");
const VerifyEmailDto = z.object({
 email: z.email(),
     code: z.string(),
});
module.exports = VerifyEmailDto;