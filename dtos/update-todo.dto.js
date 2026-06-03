const z = require("zod");

const UpdateTodoDto = z.object({
    id: z.uuidv4(),
    title: z.string(),
    description: z.string(),
});

module.exports = UpdateTodoDto;