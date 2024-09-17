const express = require("express");
const {
  createContract,
  getContractById,
  getAllContracts,
  updateContract,
  getContractPdf,
} = require("../controllers/contractController.js");
const router = express.Router();

// Route to create a new contract
router.post("/contracts", createContract);

// Route to get a contract by ID
router.get("/contract/:id", getContractById);

// Route to get all contracts
router.get("/contracts", getAllContracts);

// Route to update a contract by ID
router.put("/contracts/:id", updateContract);

// Route to get the contract PDF by userId and gigId
router.get("/user/:userId/gig/:gigId/contract-pdf", getContractPdf);

module.exports = router;
