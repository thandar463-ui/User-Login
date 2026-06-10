const z = require("zod");

const RefreshTokenDto = z.object({
    refreshToken: z.string(),
});

module.exports = RefreshTokenDto;