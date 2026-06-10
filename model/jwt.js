const jwt = require("jsonwebtoken");

function getAccessTokenSecret() {
  if (!process.env.ACCESS_TOKEN_SECRET)
    throw new Error("ACCESS_TOKEN_SECRET missing");
  return process.env.ACCESS_TOKEN_SECRET;
}

function getRefreshTokenSecret() {
  if (!process.env.REFRESH_TOKEN_SECRET)
    throw new Error("REFRESH_TOKEN_SECRET missing");
  return process.env.REFRESH_TOKEN_SECRET;
}

function signAccessToken(payload, expiresIn) {
  return jwt.sign(payload, getAccessTokenSecret(), {
    expiresIn,
  });
}

function signRefreshToken(payload, expiresIn) {
  return jwt.sign(payload, getRefreshTokenSecret(), {
    expiresIn,
  });
}

// function verifyAccessToken(token) {
//   return jwt.verify(token, getAccessTokenSecret());
// }

function verifyRefreshToken(token) {
  return jwt.verify(token, getRefreshTokenSecret());
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
}


