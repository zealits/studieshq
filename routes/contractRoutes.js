const express = require('express');
const { createContract, getContractById } = require('../controllers/contractController.js');
const router = express.Router();

// Route to create a new contract
router.post('/contracts', createContract);
// Route to get a contract by ID
router.get('/contracts/:id', getContractById);

module.exports = router;
