
const RentalDetails = require("../models/rentDetailsModel");
const Property = require("../models/propertyModel");
const User = require("../models/userModel");
const { generateRandomCode } = require("../utils/common");


const requestSignAgreement = async (req, res) => {
  try {
    const data = req.body;
    if (
      !data.propertyCode ||
      !data.tenantEmail ||
      !data.rentStartDay ||
      !data.rentEndDay ||
      !data.tenantSignature
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    data.requestId = "RE-REQ-" + generateRandomCode(6);
    // Populate Property, Landlord, and Tenant Data (replace ... with actual data)
    const property = await Property.findOne(
      { propertyCode: data.propertyCode },
      { timeout: false } // Disable timeout
    );
    const landlord = await User.findOne({ email: property.landlordEmail });
    const tenant = await User.findOne({ email: data.tenantEmail });

    const rentalDetails = new RentalDetails({
      property: property,
      landlord: landlord,
      tenant: tenant,
      requestId: data.requestId,
      requestForRentDate: Date.now(),
      requestAcceptingDateByLandlord: 0,
      agreementSigningDate: 0,
      rentStartDay: data.rentStartDay,
      rentEndDay: data.rentEndDay,
      tenantSignature: data.tenantSignature,
      landlordSignature: "",
      status: "RequestedForRent",
    });

    await rentalDetails.save();

   

    return res.status(200).json({
      message: "Agreement signed and stored successfully",
      rentalDetails: rentalDetails,
      
    });
  } catch (error) {
    console.error("Error signing and storing agreement:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
};

const approveAgreement = async (req, res) => {
  try {
    const data = req.body;
    const rentalDetails = await RentalDetails.findOne({
      requestId: data.requestId,
    });
    if (!rentalDetails) {
      return res
        .status(400)
        .json({ message: "Rental details not found in the database" });
    }
    const propertyObj = await rentalDetails.populate("property");
    const allRequests = await RentalDetails.find({
      property: rentalDetails.property,
      status: "RequestedForRent",
      requestId: { $ne: data.requestId },
    });

    // Update MongoDB entry to mark agreement as approved
    const mongoResponse = await Promise.all([
      RentalDetails.findOneAndUpdate(
        { requestId: data.requestId },
        {
          requestAcceptingDateByLandlord: Date.now(),
          landlordSignature: data.landlordSignature,
          status: "ApprovedForPayment",
        }
      ),
      Property.findOneAndUpdate(
        { _id: rentalDetails.property },
        { $set: { isAvailable: false } }
      ),
    ]);

    // Update status of all other requests to "RequestCancelled"
    if (allRequests.length > 0) {
      await RentalDetails.updateMany(
        {
          property: rentalDetails.property,
          status: "RequestedForRent",
          requestId: { $ne: data.requestId },
        },
        { $set: { status: "RequestCancelled" } }
      );
    }

    
    return res.status(200).json({
      message:
        "Agreement approved and Hedera transaction executed successfully",
      approveAgreement: mongoResponse,
    });
  } catch (error) {
    console.error("Error approving agreement:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
};

const getRequests = async (req, res) => {
  try {
    const { role, userId, propertyId } = req.query;

    if (!role || !userId) {
      return res
        .status(400)
        .json({ error: "Role and userId are required query parameters." });
    }

    let requests;

    if (role === "Landlord" && propertyId) {
      requests = await RentalDetails.find({
        landlord: userId,
        property: propertyId,
      }).populate("property landlord tenant");
    } else if (role === "Tenant") {
      requests = await RentalDetails.find({ tenant: userId }).populate(
        "property landlord tenant"
      );
    } else {
      return res.status(400).json({ error: "Invalid role." });
    }

    return res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRentedProperties = async (req, res) => {
  try {
    const userId = req.query.userId; // Extract the userId from req.query

    const rentedProperties = await RentalDetails.find({
      tenant: userId,
      status: "AgreementSigned",
    }).populate("property landlord tenant");

    res.json(rentedProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  requestSignAgreement,
  approveAgreement,
  getRequests,
  getRentedProperties,
};
