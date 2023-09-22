const express = require("express");
const router = express.Router();
const {
  requestVisit,
  getVisitedProperties,
  approveVisit,
  declineVisit,
  callVisit,
} = require("../controllers/visitPropertyController");

router.post("/requestVisit", requestVisit);
router.get("/getVisitedProperties", getVisitedProperties);
router.put("/approveVisit", approveVisit);
router.put("/declineVisit", declineVisit);
router.put("/callVisit", callVisit);
module.exports = router;
