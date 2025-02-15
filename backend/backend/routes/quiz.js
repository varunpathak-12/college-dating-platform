const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const QuizResponse = require("../models/QuizResponse");

const router = express.Router();

// @route   POST /api/quiz/submit
// @desc    Save or update user's quiz responses
// @access  Private (Requires JWT)
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const { responses } = req.body;

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ msg: "Invalid quiz responses" });
    }

    const userId = req.user.id;

    let quizResponse = await QuizResponse.findOne({ userId });

    if (quizResponse) {
      // Update existing responses
      quizResponse.responses = responses;
      await quizResponse.save();
      return res.json({ msg: "Quiz responses updated successfully!" });
    } else {
      // Create new quiz response entry
      quizResponse = new QuizResponse({ userId, responses });
      await quizResponse.save();
      return res.json({ msg: "Quiz responses saved successfully!" });
    }
  } catch (err) {
    console.error("Quiz submission error:", err);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/quiz/results
// @desc    Get user's quiz responses
// @access  Private (Requires JWT)
router.get("/results", authMiddleware, async (req, res) => {
  try {
    const quizResponses = await QuizResponse.findOne({ userId: req.user.id });

    if (!quizResponses) {
      return res.status(404).json({ msg: "No quiz responses found" });
    }

    res.json(quizResponses);
  } catch (err) {
    console.error("Fetching quiz responses error:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
