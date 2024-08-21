const express = require("express");
const { enable2FA, verify2FA,update2FAStatus } = require("../controllers/authController");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/enable-2fa", isAuthenticatedUser, enable2FA);
router.post("/verify-2fa", isAuthenticatedUser, verify2FA);
// Assuming Express.js
router.put('/me/update-2fa-status', isAuthenticatedUser, update2FAStatus);


module.exports = router;
