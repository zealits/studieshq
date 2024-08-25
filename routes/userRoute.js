const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
  applyForGig,
  approveGig,
  completeGig,
  getAllGigsWithApplicants,
  requestGiftCard,
  approveGiftCard,
  sendTableDataEmail,
  updateBasicInfo,
  updateEducation,
  updateExperience,
  updateSkills,
  updateLanguages,
  sendGiftCard,
  getAllGiftCardTypes,
  updateGigBudget,
  verifyEmail,
  sendOtp,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router.route("/send-otp").post(sendOtp);
router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

// New route for updating basic information
router.route("/me/basic-info").put(isAuthenticatedUser, updateBasicInfo);
router.route("/me/education").put(isAuthenticatedUser, updateEducation);
router.route("/me/experience").put(isAuthenticatedUser, updateExperience);
router.route("/me/skills").put(isAuthenticatedUser, updateSkills);
router.route("/me/languages").put(isAuthenticatedUser, updateLanguages);

router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin", "superadmin"), getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin", "superadmin"), getSingleUser);
router.route("/admin/user/:id").put(isAuthenticatedUser, authorizeRoles("admin", "superadmin"), updateUserRole);
router.route("/admin/user/:id").delete(isAuthenticatedUser, authorizeRoles("admin", "superadmin"), deleteUser);

// Gig Routes
router.route("/gig/apply").post(isAuthenticatedUser, applyForGig);
router
  .route("/admin/gig/approve/:userId/:gigId")
  .put(isAuthenticatedUser, authorizeRoles("admin", "superadmin"), approveGig);
router.route("/gig/complete/:gigId").put(isAuthenticatedUser, completeGig);
router.route("/admin/gigs").get(isAuthenticatedUser, authorizeRoles("admin", "superadmin"), getAllGigsWithApplicants);

// Gift Card Routes
router.route("/gig/:gigId/request-gift-card").post(isAuthenticatedUser, requestGiftCard);
router
  .route("/admin/gift-card/approve/:userId/:gigId")
  .put(isAuthenticatedUser, authorizeRoles("admin", "superadmin"), approveGiftCard);

// Send Gift Card Route (Admin Only)
router
  .route("/admin/gift-card/send/:userId/:gigId")
  .post(isAuthenticatedUser, authorizeRoles("superadmin"), sendGiftCard);
// Get All Gift Card Types Route (Admin Only)
router
  .route("/admin/gift-card/types")
  .get(isAuthenticatedUser, authorizeRoles("user", "admin", "superadmin"), getAllGiftCardTypes);

// New Route: Update Budget for a Gig (Admin Only)
router
  .route("/admin/gig/budget/:userId/:gigId")
  .put(isAuthenticatedUser, authorizeRoles("admin", "superadmin"), updateGigBudget);

router.post("/send-email", sendTableDataEmail);

module.exports = router;
