const { generateRandomCode } = require("../utils/common");
const Payment = require("../models/paymentModal");
const RentalDetails = require("../models/rentDetailsModel");
const Property = require("../models/propertyModel");
const User = require("../models/userModel");
const createPayment = async (req, res) => {
  try {
    const { propertyId, landlordId, tenantId, rentalDetailsId } = req.body;

    // Validate propertyId
    const property = await Property.findById(propertyId);

    const landlord = await User.findById(landlordId);
    const tenant = await User.findById(tenantId);
    const rental = await RentalDetails.findById(rentalDetailsId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    if (!landlord) {
      return res.status(404).json({ message: "Landlord not found" });
    }

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    // Generate a paymentId using generateRandomCode
    const paymentId = "RE-PAY-" + generateRandomCode(8); // Adjust the code length as needed

    // Create a new payment
    const payment = new Payment({
      property: propertyId,
      landlord: landlordId,
      tenant: tenantId,
      rentalDetails: rentalDetailsId,
      amount: property.securityDeposit,
      paymentId: paymentId,
    });

    // Save the payment
    await payment.save();
    const rentalDetail = await RentalDetails.findOneAndUpdate(
      { _id: rentalDetailsId },
      { status: "AgreementSigned" },
      { new: true } // To get the updated rental detail object
    );

    if (!rentalDetail) {
      return res.status(404).json({ message: "Rental detail not found" });
    }
    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPayment,
};
