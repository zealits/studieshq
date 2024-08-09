const mongoose = require("mongoose");
const ServiceDetail = require("../models/serviceDetailSchema.js");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

exports.createServiceDetail = catchAsyncErrors(async (req, res, next) => {
  try {
    const serviceDetail = await ServiceDetail.create(req.body);

    res.status(201).json({
      success: true,
      serviceDetail,
    });
  } catch (error) {
    next(error);
  }
});

exports.getAllServiceDetails = catchAsyncErrors(async (req, res, next) => {
  const serviceDetailsCount = await ServiceDetail.countDocuments();
  const resultPerPage = 1000;

  console.log("received");
  const apiFeatures = new ApiFeatures(ServiceDetail.find(), req.query).search().pagination(resultPerPage);
  const serviceDetails = await apiFeatures.query;

  res.status(200).json({
    success: true,
    serviceDetails,
    serviceDetailsCount,
    resultPerPage,
  });
});

exports.getServiceDetail = catchAsyncErrors(async (req, res, next) => {
  try {
    const serviceDetail = await ServiceDetail.findById(req.params.id);

    if (!serviceDetail) {
      return next(new ErrorHander("Service Detail not found", 404));
    }

    res.status(200).json({
      success: true,
      serviceDetail,
    });
  } catch (error) {
    next(error);
  }
});

exports.updateServiceDetail = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;

    let serviceDetail = await ServiceDetail.findById(id);

    if (!serviceDetail) {
      return next(new ErrorHander("Service Detail not found", 404));
    }

    serviceDetail = await ServiceDetail.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      serviceDetail,
    });
  } catch (error) {
    next(error);
  }
});

exports.deleteServiceDetail = catchAsyncErrors(async (req, res, next) => {
  try {
    const serviceDetail = await ServiceDetail.findById(req.params.id);

    if (!serviceDetail) {
      return next(new ErrorHander("Service Detail not found", 404));
    }

    await serviceDetail.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service Detail deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});
