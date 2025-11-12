import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Leaf, Target, TrendingDown, Lightbulb } from "lucide-react";
import { mockUser } from "@/lib/mockData";

export default function Dashboard() {
  const [stats, setStats] = useState<any>({});
  const [activities, setActivities] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const goalProgress = 65;

  useEffect(() => {
    const stored = localStorage.getItem("ecotrack-activities");
    if (stored) setActivities(JSON.parse(stored));

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch monthly stats
    fetch(`${import.meta.env.VITE_API_URL}/api/stats`, { headers })
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);

    // Fetch recent activities
    fetch(`${import.meta.env.VITE_API_URL}/api/activities/recent`, { headers })
      .then((res) => res.json())
      .then(setRecentActivities)
      .catch(console.error);

    // Fetch AI recommendations
    fetch(`${import.meta.env.VITE_API_URL}/api/ai/recommendations`, { headers })
      .then((res) => res.json())
      .then(setRecommendations)
      .catch(console.error);
  }, []);

  const totalEmissions = activities.reduce(
    (sum, activity) => sum + (activity.emission || 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {mockUser.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            Here's your carbon footprint overview
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatCard
            title="Total Emissions"
            value={`${totalEmissions.toFixed(1)} kg`}
            icon={<Leaf className="h-5 w-5" />}
            subtitle="CO₂e this month"
          />
          <StatCard
            title="Active Goal Progress"
            value={`${goalProgress}%`}
            icon={<Target className="h-5 w-5" />}
            subtitle="On track to meet goal"
          />
          <StatCard
            title="Reduction Potential"
            value="8.5 kg"
            icon={<TrendingDown className="h-5 w-5" />}
            subtitle="Based on recommendations"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/activity">
                <Button className="w-full eco-gradient justify-start" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Log New Activity
                </Button>
              </Link>
              <Link to="/recommendations">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="lg"
                >
                  <Lightbulb className="h-5 w-5 mr-2" />
                  View Recommendations
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="transition-smooth">
            <CardHeader>
              <CardTitle>Latest Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">
                      {recommendations[0].suggestion ||
                        "Try walking for short distances"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Potential saving: 2.1 kg CO₂/week
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recommendations yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No activities logged yet. Start tracking your carbon footprint!
              </p>
            ) : (
              <div className="space-y-3">
                {activities.slice(-5).reverse().map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg transition-smooth"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        {activity.emission?.toFixed(2)} kg
                      </p>
                      <p className="text-xs text-muted-foreground">CO₂e</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
