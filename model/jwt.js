const jwt = require("jsonwebtoken");

function getJWTSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is not provided");
  }
  return secret;
}

function signJWT(payload) {
  return jwt.sign(payload, getJWTSecret());
}

function verifyJWT(token) {
  return jwt.verify(token, getJWTSecret());
}

module.exports = { signJWT, verifyJWT };
