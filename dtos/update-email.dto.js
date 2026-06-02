const z = require("zod");
const UpdateEmailDto = z.object({
    code: z.string(),
});
module.exports = UpdateEmailDto;