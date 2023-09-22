const express = require("express");
const cors = require("cors");
const dbConnection = require("./database/dbConnection");
const userRouter = require("./routes/userRoutes");
const propertyRouter = require("./routes/propertyRoutes");
const rentalRouter = require("./routes/rentalRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const visitRouter = require("./routes/visitRoutes");
const feedbackRouter = require("./routes/feedbackRoutes");
const bodyParser = require("body-parser");
const app = express();

require("dotenv").config();
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/property", propertyRouter);
app.use("/rent", rentalRouter);
app.use("/payment", paymentRouter);
app.use("/visitProperty", visitRouter);
app.use("/feedback", feedbackRouter);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
