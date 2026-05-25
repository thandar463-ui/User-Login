const z = require("zod");

const EditDto = z.object({

    name: z.string(),

});

module.exports = EditDto;