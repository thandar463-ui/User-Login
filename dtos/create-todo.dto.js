const z = require("zod");
const CreateTodoDto = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    });
    module.exports = CreateTodoDto;