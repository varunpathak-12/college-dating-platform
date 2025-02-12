"use client";
import { useState } from "react";

export default function QuizPage() {
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [message, setMessage] = useState("");

  const questions = [
    { id: 1, text: "Do you enjoy outdoor activities?" },
    { id: 2, text: "Are you a morning person?" },
    { id: 3, text: "Do you like reading books?" },
  ];

  const handleChange = (questionId: number, value: string) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in to submit the quiz.");
      return;
    }

    const formattedResponses = questions.map((q) => ({
      question: q.text,
      answer: responses[q.id] ?? "No answer",
    }));

    const res = await fetch("http://localhost:5001/api/quiz/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ responses: formattedResponses }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Quiz submitted successfully!");
    } else {
      setMessage(data.msg || "Error submitting quiz");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Take the Compatibility Quiz</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id}>
            <p>{q.text}</p>
            <label>
              <input
                type="radio"
                name={`question-${q.id}`}
                value="Yes"
                onChange={() => handleChange(q.id, "Yes")}
              />
              Yes
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                name={`question-${q.id}`}
                value="No"
                onChange={() => handleChange(q.id, "No")}
              />
              No
            </label>
          </div>
        ))}
        <button type="submit">Submit Quiz</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

