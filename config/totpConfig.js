const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

module.exports = {
  generateSecret: () => speakeasy.generateSecret({ length: 20 }),
  generateQRCode: (secret) => qrcode.toDataURL(secret.otpauth_url),
  verifyToken: (secret, token) => speakeasy.totp.verify({ secret, encoding: "base32", token }),
};
