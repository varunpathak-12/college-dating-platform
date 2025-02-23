import MatchmakingResults from "@/components/MatchmakingResults";

const MatchmakingPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Your Matchmaking Results</h1>
      <MatchmakingResults />
    </div>
  );
};

export default MatchmakingPage;
