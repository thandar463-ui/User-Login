const z = require("zod");
const GetUserDto = z.object({

    page: z.string().regex(/^[0-9]+$/),

    size: z.string().regex(/^[0-9]+$/),

});

module.exports = GetUserDto;