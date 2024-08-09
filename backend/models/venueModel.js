const mongoose = require('mongoose');

// MongoDB Venue Collection Schema
const venueSchema = new mongoose.Schema({
  // Step 1: Basic Information
  basicInfo: {
    venueName: { type: String, required:true },
    venueAddress: { type: String, required:true },
    venueType: { type: String },
    venueOwner: { type: String },
    photosVideos: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
   
  },
  // Step 2: Location Information
  locationInfo: {
    totalArea: { type: String }, // Total Area
    indoorArea: { type: String }, // Indoor Area
    outdoorArea: { type: String }, // Outdoor Area
    seatingCapacity: { type: String }, // Seating Capacity
    standingCapacity: { type: String }, // Standing Capacity
    // Define fields for Location Information step here
  },

  // Step 3: Services and Amenities Information
  ServicesInfo: {
    cateringServices: {
      type: String,
      enum: ["In-House", "Outsourced", "Both", "None"],
    },
    typesOfCuisine: {
      type: [String], // Types of Cuisine (multiple choices)
      enum: ["Indian", "Chinese", "Italian", "Continental", "Vegan", "Gluten-Free", "Halal", "Kosher", "Other"],
    },
    barServices: {
      type: String, // Bar Services (Available, Not Available)
      enum: ["Available", "Not Available"],
    },
    alcoholLicensing: {
      type: String, // Alcohol Licensing (Licensed, Not Licensed)
      enum: ["Licensed", "Not Licensed"],
    },
    decorServices: {
      type: String, // Decor Services (Available, Not Available)
      enum: ["Available", "Not Available"],
    },
    eventPlanningServices: {
      type: String, // Event Planning Services (Available, Not Available)
      enum: ["Available", "Not Available"],
    },
  },

  // Step 4: Booking Information 
  BookingInfo: {
    availability: {
      type: String, // Availability (Date Range Picker)
    },
    minimumNoticePeriod: {
      type: String, // Minimum Notice Period (Text Field)
    },
    cancellationPolicy: {
      type: String, // Cancellation Policy (Text Area)
    },
    pricing: {
      type: String, // Pricing (Text Field)
    },
    paymentMethodsAccepted: {
      type: [String], // Payment Methods Accepted (Checkbox Group)
      enum: ["Cash", "Credit Card", "Debit Card", "Bank Transfer", "Mobile Payment", "Other"],
    },
    insuranceRequirements: {
      type: String, // Insurance Requirements (Text Area)
    },
  },

  // Step 5: Past Event Information 
  PastEventInfo: {
    typesOfEventsHosted: {
      type: [String], // Types of Events Hosted (Checkbox Group)
      enum: ["Weddings", "Corporate Events", "Concerts", "Exhibitions", "Private Parties", "Festivals", "Workshops", "Seminars", "Other"],
    },
    clientTestimonialsAndReviews: {
      type: String, // Client Testimonials and Reviews (Text Area)
    },
    photosAndVideosFromPastEvents: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    numberOfEventsHosted: {
      type: String, // Number of Events Hosted (Text Field)
    },
    notableEventsOrClients: {
      type: String, // Notable Events or Clients (Text Area)
    },
    clientReferences: {
      type: String, // Client References (Text Area)
    },
  },

  // Step 6: Legal and Compliance Information
  LegalInfo: {
    licensesAndPermits: {
      type: String, // Licenses and Permits (Text Area)
    },
    safetyMeasures: {
      type: String, // Safety Measures (Text Area)
    },
    businessRegistrationDetails: {
      type: String, // Business Registration Details (Text Area)
    },
    taxComplianceStatus: {
      type: String, // Tax Compliance Status (Radio Buttons)
      enum: ["Compliant", "Non-Compliant"],
    },
    healthAndSafetyCertifications: {
      type: String, // Health and Safety Certifications (Text Area)
    },
    fireSafetyCompliance: {
      type: String, // Fire Safety Compliance (Radio Buttons)
      enum: ["Compliant", "Non-Compliant"],
    },
  },

  // Step 7: Environmental Impact
  EnvirInfo: {
    sustainabilityPractices: {
      type: String, // Sustainability Practices (Text Area)
    },
    noisePollutionControls: {
      type: String, // Noise Pollution Controls (Text Area)
    },
  },

 // Step 8: Preferred Vendors
VendorsInfo: {
  preferredCateringVendor: {
    type: String, // Preferred Catering Vendor (Dropdown Menu)
    enum: ["Vendor 1", "Vendor 2", "Vendor 3", /* ... */],
  },
  preferredDesignAndDecorVendor: {
    type: String, // Preferred Design and Decor Vendor (Dropdown Menu)
    enum: ["Vendor 1", "Vendor 2", "Vendor 3", /* ... */],
  },
  preferredTravelVendor: {
    type: String, // Preferred Travel Vendor (Dropdown Menu)
    enum: ["Vendor 1", "Vendor 2", "Vendor 3", /* ... */],
  },
  preferredBeautyVendor: {
    type: String, // Preferred Beauty Vendor (Dropdown Menu)
    enum: ["Vendor 1", "Vendor 2", "Vendor 3", /* ... */],
  },
  preferredPhotographyVendor: {
    type: String, // Preferred Photography Vendor (Dropdown Menu)
    enum: ["Vendor 1", "Vendor 2", "Vendor 3", /* ... */],
  },
  preferredEventPlanningVendor: {
    type: String, // Preferred Event Planning Vendor (Dropdown Menu)
    enum: ["Vendor 1", "Vendor 2", "Vendor 3", /* ... */],
  },
  preferredAudioVisualEquipmentVendor: {
    type: String, // Preferred Audio/Visual Equipment Vendor (Dropdown Menu)
    enum: ["Vendor 1", "Vendor 2", "Vendor 3", /* ... */],
  },
  preferredEntertainmentVendor: {
    type: String, // Preferred Entertainment Vendor (Dropdown Menu)
    enum: ["Vendor 1", "Vendor 2", "Vendor 3", /* ... */],
  },
  preferredAccommodationVendor: {
    type: String, // Preferred Accommodation Vendor (Dropdown Menu)
    enum: ["Vendor 1", "Vendor 2", "Vendor 3", /* ... */],
  },
  preferredPrintingAndSignageVendor: {
    type: String, // Preferred Printing and Signage Vendor (Dropdown Menu)
    enum: ["Vendor 1", "Vendor 2", "Vendor 3", /* ... */],
  },
  preferredSecurityServicesVendor: {
    type: String, // Preferred Security Services Vendor (Dropdown Menu)
    enum: ["Vendor 1", "Vendor 2", "Vendor 3", /* ... */],
  },
},


  // Step 9: Demographic and Market Data
  DemographicInfo: {
    targetAudience: {
      type: String, // Target Audience (Text Area)
    },
    competitiveLandscape: {
      type: String, // Competitive Landscape (Text Area)
    },
  },

  user:{
    type:String,
    ref:"User",
    required:true,
  },

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model('Venue', venueSchema);



