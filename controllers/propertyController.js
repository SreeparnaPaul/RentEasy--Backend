const Property = require("../models/propertyModel");

const { generateRandomCode } = require("../utils/common");
const RentalDetails = require("../models/rentDetailsModel");

const createProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    // Basic backend validation
    if (
      !propertyData.name ||
      !propertyData.description ||
      !propertyData.propertyAddress ||
      !propertyData.securityDeposit ||
      !propertyData.rentAmount ||
      !propertyData.agreementDuration ||
      !propertyData.isAvailable ||
      !propertyData.landlordEmail ||
      !propertyData.carpetArea ||
      !propertyData.furnishing ||
      !propertyData.propertyType
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    propertyData.propertyCode = "RE-" + generateRandomCode(6);
    // Save user data to MongoDB
    const newProperty = new Property(propertyData);
    const savedProperty = await newProperty.save();

  

    res.status(201).json({ savedProperty});
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred", message: error.message });
  }
};

const getPropertyByAddress = async (req, res) => {
  try {
    const propertyCode = req.query.propertyCode;
    const tenant = req.query.tenant;
    if (!propertyCode) {
      return res.status(400).json({ error: "Property Code is required" });
    }

   
    // Fetch user data from the MongoDB database
    const propertyFromDB = await Property.findOne({
      propertyCode: propertyCode,
    });

    if (!propertyFromDB) {
      return res
        .status(400)
        .json({ message: "Property not found in the database" });
    }

    const requestDetails = await RentalDetails.find({
      property: propertyFromDB._id,
      tenant: tenant,
      status: "RequestedForRent",
    });

    const isRequestSent = requestDetails.length > 0;

    const propertyData = {
      propertyFromDB,
      isRequestSent,
    };

    res.status(200).json(propertyData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const updatePropertyStatus = async (req, res) => {
  try {
    const { propertyCode } = req.body;

    const propertyFromDB = await Property.findOne({
      propertyCode: propertyCode,
      isAvailable: true,
    });
    if (!propertyFromDB) {
      return res
        .status(400)
        .json({ message: "Property not found in the database" });
    }
    // Update property status in MongoDB
    const updatedProperty = await Property.updateOne(
      { _id: ObjectId(propertyFromDB._id) },
      { $set: { isAvailable: false } }
    );

   
    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({
      message: "Property status updated successfully",
      updatedProperty,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
const getProperties = async (req, res) => {
  const {
    landlordEmail,
    role,
    propertyAddress,
    propertyType,
    rentAmountMin,
    rentAmountMax,
    furnishing,
  } = req.query;

  const query = [];

  if (propertyAddress) {
    query.push({ propertyAddress: { $regex: propertyAddress, $options: "i" } });
  }
  if (propertyType) {
    query.push({ propertyType });
  }
  if (furnishing) {
    query.push({ furnishing });
  }
  if (rentAmountMin && rentAmountMax) {
    query.push({ rentAmount: { $gte: rentAmountMin, $lte: rentAmountMax } });
  }

  if (role === "Landlord") {
    if (landlordEmail) {
      query.push({ landlordEmail });
    } else {
      res.status(400).json({ error: "Missing landlordEmail query parameter" });
    }
  }

  try {
    if (query.length > 0) {
      const properties = await Property.find({ $and: [...query] });
      res.json(properties);
    } else {
      const properties = await Property.find();
      res.json(properties);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createProperty,
  getPropertyByAddress,
  updatePropertyStatus,
  getProperties,
};
