const Property = require("../models/propertyModel");
const User = require("../models/userModel");
const VisitDetails = require("../models/visitPropertyModel");
const { generateRandomCode } = require("../utils/common");

const requestVisit = async (req, res) => {
  try {
    const data = req.body;
    if (
      !data.propertyCode ||
      !data.tenantEmail ||
      !data.visitDate ||
      !data.visitTime
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    data.visitId = "RE-VI-" + generateRandomCode(4);
    const property = await Property.findOne(
      { propertyCode: data.propertyCode },
      { timeout: false } // Disable timeout
    );
    const landlord = await User.findOne({ email: property.landlordEmail });
    const tenant = await User.findOne({ email: data.tenantEmail });
    const visitDetails = new VisitDetails({
      property: property,
      landlord: landlord,
      tenant: tenant,
      visitId: data.visitId,
      visitDate: data.visitDate,
      visitTime: data.visitTime,
      isRequestForVisit: true,
      isApproveForVisit: false,
      isVisited: false,
      status: "Requested",
    });

    await visitDetails.save();

    return res.status(200).json({
      message: "Physically property visit request sent successfully",
      visitDetails: visitDetails,
    });
  } catch (error) {
    console.error("Error sending visit request:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
};

const getVisitedProperties = async (req, res) => {
  try {
    const { role, userId, propertyId } = req.query;

    if (!role || !userId || !propertyId) {
      return res
        .status(400)
        .json({ error: "Role and userId are required query parameters." });
    }

    let requests;

    if (role === "Landlord") {
      requests = await VisitDetails.find({
        landlord: userId,
        property: propertyId,
      }).populate("property landlord tenant");
    } else if (role === "Tenant") {
      requests = await VisitDetails.find({
        tenant: userId,
        property: propertyId,
      }).populate("property landlord tenant");
    } else {
      return res.status(400).json({ error: "Invalid role." });
    }

    return res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const approveVisit = async (req, res) => {
  try {
    const data = req.body;
    const visitDetails = await VisitDetails.findOne({
      visitId: data.visitId,
    });
    if (!visitDetails) {
      return res.status(400).json({
        message: "Visited property details not found in the database",
      });
    }
    const propertyObj = await visitDetails.populate("property");

    const mongoResponse = await Promise.all([
      VisitDetails.findOneAndUpdate(
        { visitId: data.visitId },
        {
          isApproveForVisit: true,
          status: "Approved",
        }
      ),
    ]);

    return res.status(200).json({
      message: "Physical property visit approved by landlord successfully",

      mongoResponse,
    });
  } catch (error) {
    console.error("Error approving visit:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
};

const declineVisit = async (req, res) => {
  try {
    const data = req.body;
    const visitDetails = await VisitDetails.findOne({
      visitId: data.visitId,
    });
    if (!visitDetails) {
      return res.status(400).json({
        message: "Visited property details not found in the database",
      });
    }
    const propertyObj = await visitDetails.populate("property");

    const mongoResponse = await Promise.all([
      VisitDetails.findOneAndUpdate(
        { visitId: data.visitId },
        {
          isApproveForVisit: false,
          status: "Rejected",
        }
      ),
    ]);

    return res.status(200).json({
      message: "Physical property visit rejected by landlord ",

      mongoResponse,
    });
  } catch (error) {
    console.error("Error rejecting visit:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
};

const callVisit = async (req, res) => {
  try {
    const data = req.body;
    const visitDetails = await VisitDetails.findOne({
      visitId: data.visitId,
    });
    if (!visitDetails) {
      return res.status(400).json({
        message: "Visited property details not found in the database",
      });
    }
    const propertyObj = await visitDetails.populate("property");

    const mongoResponse = await Promise.all([
      VisitDetails.findOneAndUpdate(
        { visitId: data.visitId },
        {
          isVisited: data.isVisited,
          status: data.isVisited ? "Visited" : "NotVisited",
        }
      ),
    ]);

    return res.status(200).json({
      message: "Physical property visit by tenant successfully",

      mongoResponse,
    });
  } catch (error) {
    console.error("Error in visit:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  requestVisit,
  getVisitedProperties,
  approveVisit,
  declineVisit,
  callVisit,
};
