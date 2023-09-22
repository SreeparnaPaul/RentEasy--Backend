const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    landlordEmail: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
    },
    propertyAddress: {
      type: String,
      required: true,
    },
    propertyCode: {
      type: String,
      required: true,
    },
    securityDeposit: {
      type: Number,
      required: true,
    },
    rentAmount: {
      type: Number,
      required: true,
    },
    carpetArea: {
      type: String,
      required: true,
    },
    furnishing: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    agreementDuration: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true } // This adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Property", propertySchema);
