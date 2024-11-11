const Gig = require("../models/gigModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create a new gig (Admin)
exports.createGig = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.body);
  const gig = await Gig.create(req.body);

  res.status(201).json({
    success: true,
    gig,
  });
});

// Update gig (Admin)
exports.updateGig = catchAsyncErrors(async (req, res, next) => {
  let gig = await Gig.findById(req.params.id);

  if (!gig) {
    return next(new ErrorHander("Gig not found", 404));
  }

  gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    gig,
  });
});

// Delete gig (Admin)
exports.deleteGig = catchAsyncErrors(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    return next(new ErrorHander("Gig not found", 404));
  }

  await gig.deleteOne();

  res.status(200).json({
    success: true,
    message: "Gig deleted successfully",
  });
});

// Get all gigs
exports.getAllGigs = catchAsyncErrors(async (req, res, next) => {
  const gigs = await Gig.find();

  console.log("sdfds");
  res.status(200).json({
    success: true,
    gigs,
  });
});

// Get single gig
exports.getSingleGig = catchAsyncErrors(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    return next(new ErrorHander("Gig not found", 404));
  }

  res.status(200).json({
    success: true,
    gig,
  });
});

exports.getStudiesSharedWithUser = async (req, res) => {
  // const { userId } = req.params;
  console.log(userId);
  try {
    // Find all gigs where the user is listed as a referredUser
    const gigs = await Gig.find({
      "studyReferrals.referredUser": userId,
    });
    // console.log(gigs);

    if (!gigs.length) {
      return res.status(404).json({ message: "No studies found shared with this user." });
    }

    res.status(200).json({
      success: true,
      gigs,
    });
  } catch (error) {
    console.error("Error fetching studies shared with user:", error);
    res.status(500).json({ error: "Failed to fetch studies shared with this user." });
  }
};
