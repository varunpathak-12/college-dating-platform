const mongoose = require("mongoose");

const QuizResponseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  responses: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
});

const QuizResponse = mongoose.model("QuizResponse", QuizResponseSchema);

module.exports = QuizResponse; // ✅ Ensure this is exported correctly
