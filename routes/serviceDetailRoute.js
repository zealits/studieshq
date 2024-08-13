const express = require("express");
const {
  getAllServiceDetails,
  createServiceDetail,
  updateServiceDetail,
  deleteServiceDetail,
  getServiceDetail,
} = require("../controllers/serviceDetailController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/serviceDetails").get(getAllServiceDetails);
router.route("/serviceDetail/new").post(createServiceDetail);
// router.route("/serviceDetail/new").post(isAuthenticatedUser, createServiceDetail);
router.route("/serviceDetail/:id").delete(deleteServiceDetail);
router.route("/serviceDetail/:id").put(updateServiceDetail);
router.route("/serviceDetail/:id").get(getServiceDetail);

module.exports = router;
