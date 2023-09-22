const User = require("../models/userModel");


const jwt = require("jsonwebtoken");
const revokedTokens = require("../middleware/auth");
const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    console.log(userData, "+++");
    // Basic backend validation
    if (
      !userData.name ||
      !userData.role ||
      !userData.email ||
      !userData.phoneNumber ||
      !userData.password ||
      !userData.city ||
      !userData.state ||
      !userData.pincode
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields" });
    }
    userData.isKycApproved = false;
    // Save user data to MongoDB
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    console.log({ savedUser });
   
    console.log({ savedUser });
    res.status(201).json({ savedUser});
  } catch (error) {
    console.error("An error occurred:", error); // Log the complete error details
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message }); // Send the error message
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const userEmail = req.params.email;

    if (!userEmail) {
      return res.status(400).json({ error: "Email is required" });
    }


    // Fetch user data from the MongoDB database
    const userFromDB = await User.findOne({ email: userEmail });

    if (!userFromDB) {
      return res
        .status(404)
        .json({ message: "User not found in the database" });
    }

    const userData = {
      userFromDB,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("An error occurred:", error); // Log the complete error details
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, role, password } = req.body;
    if (!email || !role || !password) {
      return res
        .status(400)
        .json({ error: "Missing required fields" });
    }

    const user = await User.findOne({ email, role, password });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Set the token expiration time
    });

    res.status(200).json({
      message: "User logged in successfully",
      user,
      token, // Send the generated token in the response
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const logout = (req, res) => {
  const token = req.header("Authorization");

  if (token) {
    // Add the token to the revokedTokens list
    revokedTokens.push(token);
  }

  res.status(200).json({ message: "Logged out successfully" });
};

const kycVerification = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "Missing userId query parameter" });
    }

    const { aadharNumber, panNumber, aadharFile, panFile } = req.body;

    const result = await User.updateOne(
      { _id: userId },
      {
        $set: {
          isKycApproved: true,
          aadharNumber: aadharNumber,
          panNumber: panNumber,
          aadharFile: aadharFile,
          panFile: panFile,
        },
      }
    );

    const updatedUser = await User.findById(userId);

    res
      .status(200)
      .json({
        message: "KYC verification successful",
        user: updatedUser,
      });
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const query = req.query;

    // Fetch user data from the MongoDB database
    const userFromDB = await User.find(query);

    if (!userFromDB) {
      return res
        .status(404)
        .json({ message: "User not found in the database" });
    }

    const userData = {
      userFromDB,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("An error occurred:", error); // Log the complete error details
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
module.exports = {
  registerUser,
  getUserByEmail,
  login,
  logout,
  getUsers,
  kycVerification,
};
