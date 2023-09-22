const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rentalDetailsSchema = new Schema(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    landlord: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestId: {
      type: String,
      required: true,
    },
    requestForRentDate: {
      type: Number,
      required: true,
    },
    requestAcceptingDateByLandlord: {
      type: Number,
      required: true,
    },
    agreementSigningDate: {
      type: Number,
      required: true,
    },
    rentStartDay: {
      type: String,
      required: true,
    },
    rentEndDay: {
      type: String,
      required: true,
    },
    tenantSignature: {
      type: String,
      required: true,
    },
    landlordSignature: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RentalDetails", rentalDetailsSchema);
