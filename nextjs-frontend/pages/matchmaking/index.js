import { useEffect, useState } from "react";

export default function MatchmakingResults() {
  const [matches, setMatches] = useState([]); // Ensure matches is always an array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Get stored JWT
        const res = await fetch("http://localhost:5001/api/quiz/matchmaking", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Ensure data.matches is always an array before setting state
        setMatches(Array.isArray(data.matches) ? data.matches : []);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setMatches([]); // Fallback to empty array if error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div>
      <h1>Matchmaking Results</h1>
      {loading ? (
        <p>Loading...</p>
      ) : matches.length > 0 ? (
        <ul>
          {matches.map((match, index) => (
            <li key={index}>
              <strong>User ID:</strong> {match.userId} - <strong>Compatibility:</strong> {match.compatibilityScore}
            </li>
          ))}
        </ul>
      ) : (
        <p>No matches found.</p>
      )}
    </div>
  );
}
