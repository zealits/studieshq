const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const Gig = require("../models/gigModel.js");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
// const cloudinary = require("cloudinary");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 201, res);
});

// apply for gig
// apply for gig
exports.applyForGig = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const gigId = req.body.gigId;

  const user = await User.findById(userId);
  const gig = await Gig.findById(gigId);

  // console.log("gig :", gig);
  if (!gig) {
    return next(new ErrorHander("Gig not found", 404));
  }

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  // Convert gigId to ObjectId if needed
  // const objectIdGigId = mongoose.Types.ObjectId(gigId);

  // Check if user has already applied for the gig
  // const hasApplied = user.gigs.some((gigDetail) => gigDetail.gigId.toString() === gigId.toString());

  // if (hasApplied) {
  //   return next(new ErrorHander("You have already applied for this gig", 400));
  // }

  const usergig = {
    gigId: gigId,
    title: gig.title,
    description: gig.description,
    deadline: gig.deadline,
    budget: gig.budget,
    status: "applied",
    appliedAt: Date.now(),
  };
  // console.log("usergig :", usergig);

  user.gigs.push(usergig);
  await user.save();

  gig.applicants.push(userId);
  if (gig.status === "open") {
    gig.status = "applied";
  }
  await gig.save();

  res.status(200).json({
    success: true,
    message: "Applied for gig successfully",
  });
});

// Get all gigs with applicants (Admin)
exports.getAllGigsWithApplicants = catchAsyncErrors(async (req, res, next) => {
  // Aggregation pipeline to match gigs with applicants
  const gigs = await Gig.aggregate([
    {
      $lookup: {
        from: "users", // Collection name for users
        localField: "applicants",
        foreignField: "_id",
        as: "applicantsDetails",
      },
    },
    {
      $addFields: {
        applicantsDetails: {
          $map: {
            input: "$applicantsDetails",
            as: "applicant",
            in: {
              _id: "$$applicant._id", // Include user _id
              name: "$$applicant.name",
              email: "$$applicant.email",
              gigs: {
                $filter: {
                  input: "$$applicant.gigs",
                  as: "gigDetail",
                  cond: { $eq: ["$$gigDetail.gigId", "$_id"] },
                },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        deadline: 1,
        budget: 1,
        status: 1,
        createdAt: 1,
        applicantsDetails: 1, // Include all details of applicants
      },
    },
  ]);

  // console.log(gigs);
  res.status(200).json({
    success: true,
    gigs,
  });
});

// Approve a Gig (Admin)
exports.approveGig = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.userId;
  const gigId = req.params.gigId;

  const user = await User.findById(userId);
  const gig = await Gig.findById(gigId);

  if (!gig) {
    return next(new ErrorHander("Gig not found", 404));
  }

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  // Convert gigId to ObjectId if needed
  // const objectIdGigId = mongoose.Types.ObjectId(gigId);
  // console.log("uptil");
  // Find the gig within the user's gigs array
  const userGigIndex = user.gigs.findIndex((gigDetail) => gigDetail.gigId.equals(gigId));

  if (userGigIndex === -1) {
    return next(new ErrorHander("User's gig not found", 404));
  }

  // Update the user's gig details
  user.gigs[userGigIndex].status = "allocated";
  user.gigs[userGigIndex].allocatedAt = Date.now();
  await user.save();

  // Update the gig status
  gig.status = "allocated";
  await gig.save();

  // console.log("upd");
  res.status(200).json({
    success: true,
    message: "Gig approved successfully",
  });
});

// Complete a Gig
exports.completeGig = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user.id;
  const gigId = req.params.gigId;

  const user = await User.findById(userId);
  const gig = await Gig.findById(gigId);

  // console.log(gigId);
  if (!gig) {
    return next(new ErrorHander("Gig not found", 404));
  }

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  // Convert gigId to ObjectId if needed
  // const objectIdGigId = mongoose.Types.ObjectId(gigId);

  // Find the gig within the user's gigs array

  const userGigIndex = user.gigs.findIndex((gigDetail) => gigDetail.gigId.equals(gigId));

  // console.log("here");
  if (userGigIndex === -1) {
    return next(new ErrorHander("User's gig not found", 404));
  }

  // Update the user's gig details

  user.gigs[userGigIndex].status = "completed";
  user.gigs[userGigIndex].completedAt = Date.now();
  await user.save();

  // Update the gig status
  gig.status = "completed";
  await gig.save();

  // console.log("sdfs");
  res.status(200).json({
    success: true,
    message: "Gig completed successfully",
  });
});

//Login User

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password b", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//  Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  //   // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/aak/l1/password/reset/${resetToken}`;

  // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
  const message = `Your password reset token is s :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Venue Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHander("Reset Password Token is invalid or has been expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// // Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // if (req.body.avatar !== "") {
  //   const user = await User.findById(req.user.id);

  //   const imageId = user.avatar.public_id;

  //   await cloudinary.v2.uploader.destroy(imageId);

  //   const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //     folder: "avatars",
  //     width: 150,
  //     crop: "scale",
  //   });

  //   newUserData.avatar = {
  //     public_id: myCloud.public_id,
  //     url: myCloud.secure_url,
  //   };
  // }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//
//
//
// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400));
  }

  // const imageId = user.avatar.public_id;

  // await cloudinary.v2.uploader.destroy(imageId);

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

exports.requestGiftCard = async (req, res, next) => {
  try {
    const { gigId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    const gig = user.gigs.id(gigId);
    if (gig && gig.status === "completed") {
      gig.paymentStatus = "requested";
      gig.requestGiftCardAt = Date.now();

      await user.save();

      res.status(200).json({
        success: true,
        message: "Gift card request submitted successfully!",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Gig not found or not completed.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting gift card request. Please try again later.",
    });
  }
};

exports.approveGiftCard = async (req, res, next) => {
  try {
    const { userId, gigId } = req.params;
    const { giftCardOption } = req.body; // Get giftCardOption from the request body

    const user = await User.findById(userId);

    const gig = user.gigs.id(gigId);
    if (gig && gig.paymentStatus === "requested") {
      gig.paymentStatus = "approved";
      gig.giftCardApprovedAt = Date.now();
      gig.giftCardOption = giftCardOption; // Store the giftCardOption in the gig
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Gift card request approved successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error approving gift card request. Please try again later.",
    });
  }
};

exports.sendTableDataEmail = catchAsyncErrors(async (req, res, next) => {
  // Log the request body for debugging
  console.log("Request body:", req.body);

  const { email, tableData } = req.body;

  // Validate the presence of email and table data
  if (!email || !tableData) {
    console.error("Email and table data are required");
    return next(new ErrorHander("Email and table data are required", 400));
  }

  // Compose the email message
  const message = `
    <p>Here is the table data:</p>
    ${tableData}
  `;

  try {
    // Send the email
    await sendEmail({
      email: email,
      subject: "Table Data from Manage Payout",
      html: message, // Use html to send the table data
    });

    // Log success message
    console.log(`Table data sent to ${email} successfully`);

    // Respond with success
    res.status(200).json({
      success: true,
      message: `Table data sent to ${email} successfully`,
    });
  } catch (error) {
    // Log the error
    console.error("Error sending email:", error);

    // Handle the error with a 500 status code
    return next(new ErrorHander(error.message, 500));
  }
});

// Update User Basic Info
exports.updateBasicInfo = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    middleName,
    lastName,
    gender,
    dateOfBirth,
    country,
    state,
    city,
    contactNumber,
    education, // Include education in the request body
    experience,
    languages,
    skills,
  } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth,
      country,
      state,
      city,
      contactNumber,
      education, // Update education as well
      experience,
      languages,
      skills,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User basic information and education updated successfully",
    user: updatedUser,
  });
});

// Controller to update user education
exports.updateEducation = catchAsyncErrors(async (req, res, next) => {
  const { education } = req.body; // Assuming education is an array of education objects

  // Find user and update education details
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Update education details
  user.education = education;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Education updated successfully",
    education: user.education,
  });
});

// Controller to update user experience
exports.updateExperience = catchAsyncErrors(async (req, res, next) => {
  const { experience } = req.body; // Assuming experience is an array of experience objects

  // Find user and update experience details
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Update experience details
  user.experience = experience;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Experience updated successfully",
    experience: user.experience,
  });
});

// Controller to update user skills
exports.updateSkills = catchAsyncErrors(async (req, res, next) => {
  const { skills } = req.body; // Assuming skills is an array of skill objects

  // Find user and update skills details
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Update skills details
  user.skills = skills;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Skills updated successfully",
    skills: user.skills,
  });
});

// Controller to update user languages
exports.updateLanguages = catchAsyncErrors(async (req, res, next) => {
  const { languages } = req.body; // Assuming languages is an array of language objects

  // Find user and update languages details
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Update languages details
  user.languages = languages;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Languages updated successfully",
    languages: user.languages,
  });
});
