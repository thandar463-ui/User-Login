const z = require("zod");
const SendOtpDto = z.object({
    email: z.email(),
});
module.exports = SendOtpDto;