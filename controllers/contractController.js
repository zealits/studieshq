const Contract = require("../models/contractModel");
const { PDFDocument } = require("pdf-lib"); // or use pdfkit
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");

exports.createContract = async (req, res) => {
  try {
    const { userId, jobTitle, projectDetails, freelanceStudyDetails, signature, filename } = req.body;

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    page.drawText(`Contract for ${jobTitle}`, { x: 50, y: 350, size: 15 });
    page.drawText(`Project Details: ${projectDetails}`, { x: 50, y: 320, size: 12 });
    page.drawText(`Freelance Study Details: ${freelanceStudyDetails}`, { x: 50, y: 300, size: 12 });

    // Embed the signature as an image
    // if (signature) {
    //   const base64Data = signature.replace(/^data:image\/png;base64,/, "");
    //   try {
    //     const signatureImage = await pdfDoc.embedPng(Buffer.from(base64Data, "base64"));
    //     page.drawImage(signatureImage, { x: 50, y: 250, width: 100, height: 50 });
    //   } catch (error) {
    //     console.error("Error embedding PNG image:", error.message);
    //     return res.status(400).json({ message: "Invalid signature image data" });
    //   }
    // }

    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    // console.log("adsfd : ", pdfBytes);
    // Save PDF data to MongoDB
    const contract = new Contract({
      filename,
      userId,
      jobTitle,
      projectDetails,
      freelanceStudyDetails,
      // signature,
      pdfData: pdfBuffer, // Store PDF binary data
    });

    await contract.save();

    res.status(201).json({ message: "Contract created successfully", contract });
  } catch (error) {
    console.error("Error creating contract:", error); // Log the error to see more details
    res.status(500).json({ message: "Error creating contract", error: error.message });
  }
};

// Get a contract by ID
exports.getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }
    res.status(200).json(contract);
  } catch (error) {
    console.error(error); // Log the error to see more details
    res.status(500).json({ message: "Error retrieving contract", error: error.message });
  }
};

exports.getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.find();

    // Convert binary PDF data to Base64 string for each contract
    // const contractsWithBase64PDF = contracts.map((contract) => {
    //   if (contract.pdfData && contract.pdfData.buffer) {
    //     // Convert the Buffer data to Base64 string
    //     contract.pdfData = contract.pdfData.buffer.toString("base64");
    //   }
    //   return contract;
    // });

    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: "Failed to get contracts", error });
  }
};

exports.updateContract = async (req, res) => {
  try {
    const { contractId, email } = req.body;

    console.log(email);

    // Find the existing contract
    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // Load the existing PDF
    const pdfDoc = await PDFDocument.load(contract.pdfData);

    // Add new page or update an existing page to add email
    const page = pdfDoc.getPage(0); // assuming you want to update the first page
    page.drawText(`Email: ${email}`, { x: 50, y: 280, size: 12 });

    // Save the updated PDF
    const updatedPdfBytes = await pdfDoc.save();
    const updatedPdfBuffer = Buffer.from(updatedPdfBytes);

    // Update the contract data with new email and PDF
    contract.email = email;
    contract.pdfData = updatedPdfBuffer;

    await contract.save();

    res.status(200).json({ message: "Contract updated successfully", contract });
  } catch (error) {
    console.error("Error updating contract:", error);
    res.status(500).json({ message: "Error updating contract", error: error.message });
  }
};
