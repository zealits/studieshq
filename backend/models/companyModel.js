const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
   
  },
  serviceType: {
    type: String,
   
  },
  icon: {
    type: String,
  },
  yearEstablished: {
    type: Number,
  },
  employees: {
    type: Number,
  },
  rating: {
    type: Number,
 
  },
  services: {
    type: [String],
  },
  info: {
    type: String,
  },
  website: {
    type: String,
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Company', companySchema);
