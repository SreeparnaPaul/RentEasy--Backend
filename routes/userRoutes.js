const express = require("express");
const {
  registerUser,
  getUserByEmail,
  login,
  logout,
  kycVerification,
  getUsers,
} = require("../controllers/userController");
const router = express.Router();

router.post("/signup", registerUser);
router.get("/getUser/:email", getUserByEmail);
router.post("/login", login);
router.post("/logout", logout);
router.put("/kycVerification", kycVerification);
router.get("/getUsers", getUsers);

module.exports = router;
