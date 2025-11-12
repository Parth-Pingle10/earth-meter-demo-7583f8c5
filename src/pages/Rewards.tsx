import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock } from "lucide-react";
import { toast } from "sonner";

// 🌍 Backend API URL
const API_BASE_URL = "http://localhost:5000/api";

interface Reward {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
}

const Rewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);

  // 🧩 Fetch rewards from backend
  const fetchRewards = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(`${API_BASE_URL}/rewards/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch rewards");
      const data = await res.json();
      setRewards(data);
    } catch (err) {
      toast.error("Failed to load rewards. Showing demo data.");
      setRewards([
        {
          id: 1,
          name: "🌱 Green Starter",
          description: "You’ve logged your first activity!",
          unlocked: true,
        },
        {
          id: 2,
          name: "🚴 Eco Traveler",
          description: "Reduced car usage for 7 days.",
          unlocked: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 animate-fade-in max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Rewards</h1>
          <p className="text-muted-foreground">
            Unlock badges as you reduce your carbon footprint
          </p>
        </div>

        {loading && (
          <p className="text-muted-foreground text-center mb-6">Loading rewards...</p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {rewards.map((reward, index) => (
            <Card
              key={reward.id}
              className={`transition-smooth animate-fade-in ${
                reward.unlocked ? "bg-card" : "bg-muted/50"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-4xl ${
                        !reward.unlocked && "grayscale opacity-50"
                      }`}
                    >
                      {reward.name.split(" ")[0]}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {reward.name.split(" ").slice(1).join(" ")}
                        {reward.unlocked ? (
                          <Badge className="eco-gradient">Unlocked</Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-sm ${
                    reward.unlocked
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {reward.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 eco-gradient">
          <CardContent className="pt-6">
            <div className="text-center text-white">
              <Trophy className="h-16 w-16 mx-auto mb-4 animate-glow" />
              <h3 className="text-2xl font-bold mb-2">Keep Going!</h3>
              <p className="text-white/90">
                Continue your eco-friendly journey to unlock more badges
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Rewards;
  