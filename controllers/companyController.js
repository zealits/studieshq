const mongoose = require("mongoose");
const Company = require("../models/companyModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

exports.createCompany = catchAsyncErrors(async (req, res, next) => {
  try {
    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      company,
    });
  } catch (error) {
    next(error);
  }
});

exports.getAllCompanies = catchAsyncErrors(async (req, res, next) => {
  const companiesCount = await Company.countDocuments();
  const resultPerPage = 1000;

  console.log("received");
  const apiFeatures = new ApiFeatures(Company.find(), req.query);
  const companies = await apiFeatures.query;

  res.status(200).json({
    success: true,
    companies,
    companiesCount,
    resultPerPage,
  });
});

exports.getCompanyDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return next(new ErrorHander("Company not found", 404));
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    next(error);
  }
});

exports.updateCompany = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;

    let company = await Company.findById(id);

    if (!company) {
      return next(new ErrorHander("Company not found", 404));
    }

    company = await Company.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    next(error);
  }
});

exports.deleteCompany = catchAsyncErrors(async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return next(new ErrorHander("Company not found", 404));
    }

    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});
