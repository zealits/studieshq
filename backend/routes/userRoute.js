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
  requestGiftCard, // New route for requesting a gift card
  approveGiftCard,
  sendTableDataEmail, // New route for admin to approve gift card requests
  updateBasicInfo,
  updateEducation,
  updateExperience,
  updateSkills,
  updateLanguages,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
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


router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);
router.route("/admin/user/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);
router.route("/admin/user/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

// Gig Routes
router.route("/gig/apply").post(isAuthenticatedUser, applyForGig);
router.route("/admin/gig/approve/:userId/:gigId").put(isAuthenticatedUser, authorizeRoles("admin"), approveGig);
router.route("/gig/complete/:gigId").put(isAuthenticatedUser, completeGig);
router.route("/admin/gigs").get(isAuthenticatedUser, authorizeRoles("admin"), getAllGigsWithApplicants);

// Gift Card Routes
router.route("/gig/:gigId/request-gift-card").post(isAuthenticatedUser, requestGiftCard);
router
  .route("/admin/gift-card/approve/:userId/:gigId")
  .put(isAuthenticatedUser, authorizeRoles("admin"), approveGiftCard);

router.post("/send-email", sendTableDataEmail);

module.exports = router;
