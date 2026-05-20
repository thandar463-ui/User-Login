const ApiError = require("./api-error");
const z = require("zod");
function handleErrors(res,err) {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({message: err.message, statusCode: err.statusCode});
    }
    if (err instanceof z.ZodError) {
        return res.status(400).json({
            message: `Invalid data in ${err.issues.map((issue) => issue.path[0])}`,
        });
    }
    console.log(err);
    return res.status(500).json({message: err.message ?? "Internal server error"});
}
module.exports = { handleErrors };