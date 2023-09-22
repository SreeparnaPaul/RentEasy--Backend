const Feedback = require("../models/feedbackModal");
const VisitDetails = require("../models/visitPropertyModel");
const createFeedback = async (req, res, next) => {
  const feedbackData = req.body;
  console.log(feedbackData, "+++");
  try {
    const newFeedback = new Feedback(feedbackData);

    const savedFeedback = await newFeedback.save();
    console.log({ savedFeedback });
    await Promise.all([
      VisitDetails.findOneAndUpdate(
        { visitProperty: feedbackData.visitProperty },
        {
          isFeedbackGiven: true,
        }
      ),
    ]);
    res.status(200).json({ savedFeedback });
  } catch (error) {
    console.error("An error occurred:", error); // Log the complete error details
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message }); // Send the error message
  }
};
const getfeedback = async (req, res) => {
  try {
    const { visitId } = req.query;

    if (!visitId) {
      return res
        .status(400)
        .json({ error: "Visit Id are required query parameters." });
    }

    let requests;

    requests = Feedback.find({ visitId: visitId });

    return res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { createFeedback, getfeedback };
