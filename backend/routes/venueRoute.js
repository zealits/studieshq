
const express = require('express');
const { getAllVenues, createVenue, updateVenue, deleteVenue, getVenueDetails } = require('../controllers/venueController');
const { isAuthenticatedUser, authorizeRoles   } = require('../middleware/auth');
const router = express.Router();


router.route("/venues").get(getAllVenues);
router.route("/venue/new").post(createVenue);
// router.route("/venue/new").post(isAuthenticatedUser, createVenue);
router.route('/venue/:id').delete(deleteVenue);
router.route('/venue/:id').put(updateVenue);
router.route('/venue/:id').get(getVenueDetails);

module.exports = router;
