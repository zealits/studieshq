const express = require("express");
const multer = require("multer");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { createGig, updateGig, deleteGig, getAllGigs, getSingleGig } = require("../controllers/gigController");

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const router = express.Router();

// Admin routes
router.route("/admin/gig").post(isAuthenticatedUser, authorizeRoles("admin"), upload.single("image"), createGig);
router
  .route("/admin/gig/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateGig)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteGig);

// Public routes
router.route("/gigs").get(getAllGigs);
router.route("/gig/:id").get(getSingleGig);

module.exports = router;
