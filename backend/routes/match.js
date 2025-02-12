const express = require("express");
const router = express.Router();
const QuizResponse = require("../models/QuizResponse");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/find-matches", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    console.log(`🔍 Finding matches for user: ${currentUserId}`);

    const currentUserQuiz = await QuizResponse.findOne({ userId: currentUserId });

    if (!currentUserQuiz) {
      return res.status(404).json({ msg: "No quiz responses found for this user" });
    }

    const allResponses = await QuizResponse.find({ userId: { $ne: currentUserId } });

    if (!allResponses.length) {
      return res.status(404).json({ msg: "No other users found for matching" });
    }

    let bestMatches = allResponses.map((otherUser) => {
      let score = 0;
      let totalQuestions = currentUserQuiz.responses.length;

      currentUserQuiz.responses.forEach((currentResponse) => {
        let match = otherUser.responses.find(
          (r) => r.question === currentResponse.question && r.answer === currentResponse.answer
        );
        if (match) {
          score++;
        }
      });

      let compatibility = (score / totalQuestions) * 100;

      return {
        userId: otherUser.userId,
        compatibilityScore: compatibility.toFixed(2), // ✅ Return fixed decimal value
      };
    });

    bestMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    console.log(`✅ Found ${bestMatches.length} matches for user ${currentUserId}`);

    res.json({ matches: bestMatches });
  } catch (error) {
    console.error("❌ Error finding matches:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

