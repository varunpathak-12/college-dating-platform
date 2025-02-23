import { useState, useEffect } from "react";

const MatchmakingResults = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch("http://localhost:5001/api/quiz/matchmaking", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch matchmaking results");
        }

        const data = await response.json();
        setMatches(data.matches || []);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Matchmaking Results</h2>
      {loading ? (
        <p>Loading...</p>
      ) : matches.length > 0 ? (
        <ul>
          {matches.map((match, index) => (
            <li key={index} className="mb-2 p-2 border rounded">
              User ID: {match.userId} | Compatibility Score: {match.compatibilityScore}
            </li>
          ))}
        </ul>
      ) : (
        <p>No matches found.</p>
      )}
    </div>
  );
};

export default MatchmakingResults;
