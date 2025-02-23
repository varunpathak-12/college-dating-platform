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
    const userId = req.user.id;
    const quizResponses = await QuizResponse.findOne({ userId });

    if (!quizResponses) {
      return res.status(404).json({ msg: "No quiz responses found" });
    }

    res.json(quizResponses);
  } catch (err) {
    console.error("Fetching quiz responses error:", err);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/quiz/matchmaking
// @desc    Find the most compatible matches based on quiz responses
// @access  Private (Requires JWT)
router.get("/matchmaking", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the current user's quiz responses
    const currentUserResponse = await QuizResponse.findOne({ userId });

    if (!currentUserResponse) {
      return res.status(404).json({ msg: "User has not submitted quiz responses yet" });
    }

    // Get all other users' quiz responses
    const allResponses = await QuizResponse.find({ userId: { $ne: userId } });

    if (allResponses.length === 0) {
      return res.status(404).json({ msg: "No other quiz responses found for matchmaking" });
    }

    // Function to calculate compatibility score
    const calculateCompatibility = (user1, user2) => {
      let score = 0;
      const user1Responses = user1.responses;
      const user2Responses = user2.responses;

      user1Responses.forEach((q1, index) => {
        if (user2Responses[index] && q1.answer === user2Responses[index].answer) {
          score += 1; // Increase score for each matching answer
        }
      });

      return score;
    };

    // Compute compatibility scores with other users
    const matches = allResponses.map((otherUser) => ({
      userId: otherUser.userId,
      compatibilityScore: calculateCompatibility(currentUserResponse, otherUser),
    }));

    // Sort matches by highest compatibility score
    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json({ matches });
  } catch (err) {
    console.error("Matchmaking error:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
