const express = require("express");
const {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyDetails,
} = require("../controllers/companyController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/companies").get(getAllCompanies);
router.route("/company/new").post(createCompany);
// router.route("/company/new").post(isAuthenticatedUser, createCompany);
router.route("/company/:id").delete(deleteCompany);
router.route("/company/:id").put(updateCompany);
router.route("/company/:id").get(getCompanyDetails);

module.exports = router;
