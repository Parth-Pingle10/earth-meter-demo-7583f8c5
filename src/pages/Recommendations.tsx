import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// 🌍 Backend API URL
const API_BASE_URL = "http://localhost:5000/api";

interface Recommendation {
  id: number;
  icon: string;
  text: string;
  impact: string;
}

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Fetch AI-powered tips from backend
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(`${API_BASE_URL}/recommendations/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch recommendations");

      const data = await res.json();
      setRecommendations(data);
    } catch (err) {
      toast.error("Failed to load recommendations. Showing defaults.");
    } finally {
      setLoading(false);
    }
  };

  // ♻️ Generate new recommendations (AI re-fetch)
  const generateNewTips = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(`${API_BASE_URL}/recommendations/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) throw new Error("Failed to refresh recommendations");
      const newData = await res.json();
      setRecommendations(newData);
      toast.success("New AI recommendations generated!");
    } catch (err) {
      toast.error("Could not fetch new recommendations.");
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 animate-fade-in max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recommendations</h1>
            <p className="text-muted-foreground">
              AI-powered tips to reduce your carbon footprint
            </p>
          </div>

          <Button onClick={generateNewTips} variant="outline" disabled={loading}>
            <RefreshCw className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Generating..." : "Generate New Tips"}
          </Button>
        </div>

        {recommendations.length === 0 && !loading && (
          <p className="text-muted-foreground text-center mt-12">
            No recommendations yet. Try generating some!
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {recommendations.map((rec, index) => (
            <Card
              key={rec.id}
              className="transition-smooth animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="flex items-start gap-3">
                  <span className="text-3xl">{rec.icon}</span>
                  <div className="flex-1">
                    <Lightbulb className="h-5 w-5 text-primary mb-2" />
                    <p className="text-base font-normal leading-relaxed">
                      {rec.text}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Impact: {rec.impact}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Recommendations;
