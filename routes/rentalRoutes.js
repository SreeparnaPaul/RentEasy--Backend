const express = require("express");
const router = express.Router();
const {
  requestSignAgreement,
  approveAgreement,
  getRequests,
  getRentedProperties,
} = require("../controllers/rentalController");

router.post("/requestSignAgreement", requestSignAgreement);
router.post("/approveAgreement", approveAgreement);
router.get("/getRequests", getRequests);
router.get("/getRentedProperties", getRentedProperties);

module.exports = router;
