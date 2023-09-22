const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    presentAddress: {
      type: String,
    },
    permanentAddress: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    aadharNumber: {
      type: String,
    },
    panNumber: {
      type: String,
    },
    isKycApproved: {
      type: Boolean,
      required: true,
    },
    aadharFile: {
      type: String,
    },
    panFile: {
      type: String,
    },
    area: {
      type: String,
    },
  },
  { timestamps: true } // This adds createdAt and updatedAt fields
);

module.exports = mongoose.model("User", userSchema);
