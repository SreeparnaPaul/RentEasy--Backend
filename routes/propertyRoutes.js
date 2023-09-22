const express = require("express");
const {
  createProperty,
  getPropertyByAddress,
  getProperties,
} = require("../controllers/propertyController");
const router = express.Router();
router.post("/addProperty", createProperty);
router.get("/getProperty", getPropertyByAddress);
router.get("/getProperties", getProperties);

module.exports = router;
