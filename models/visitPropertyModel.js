const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const visitPropertySchema = new Schema(
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
    visitDate: {
      type: String,
      required: true,
    },
    visitTime: {
      type: String,
      required: true,
    },
    visitId: {
      type: String,
      required: true,
    },
    isRequestForVisit: {
      type: Boolean,
      required: true,
    },
    isApproveForVisit: {
      type: Boolean,
      required: true,
    },
    isVisited: {
      type: Boolean,
      required: true,
    },
    isFeedbackGiven: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // This adds createdAt and updatedAt fields
);

module.exports = mongoose.model("VisitProperty", visitPropertySchema);
