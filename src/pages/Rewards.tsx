import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockRewards } from "@/lib/mockData";
import { Trophy, Lock, Award } from "lucide-react";

const Rewards = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 animate-fade-in max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Rewards</h1>
          <p className="text-muted-foreground">Unlock badges as you reduce your carbon footprint</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {mockRewards.map((reward, index) => (
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
                    <Award
                      className={`h-6 w-6 ${
                        !reward.unlocked && "grayscale opacity-50"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{reward.name}</span>
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
