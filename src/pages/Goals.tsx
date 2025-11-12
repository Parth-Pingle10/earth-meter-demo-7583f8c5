import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Target, Plus, TrendingUp, History } from "lucide-react";
import { toast } from "sonner";
import axios from "axios"; // ✅ added axios
import { mockGoals } from "@/lib/mockData";

const Goals = () => {
  const [goals, setGoals] = useState(mockGoals);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);

  const API_BASE_URL = "http://localhost:5000/api"; // ✅ backend URL

  // ✅ Fetch goals and activities from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goalsRes, activitiesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/goals`),
          axios.get(`${API_BASE_URL}/activities/history`)
        ]);
        setGoals(goalsRes.data || []);
        setActivities(activitiesRes.data || []);
      } catch (err) {
        console.warn("Backend fetch failed, using local mock data:", err);
        const stored = localStorage.getItem("ecotrack-activities");
        if (stored) setActivities(JSON.parse(stored));
      }
    };

    fetchData();
  }, []);

  // ✅ Add new goal to backend
  const handleCreateGoal = async () => {
    if (!newGoalName || !newGoalTarget) {
      toast.error("Please fill all fields");
      return;
    }

    const newGoal = {
      id: goals.length + 1,
      target: newGoalName,
      targetValue: parseFloat(newGoalTarget),
      progress: 0,
      status: "Active" as const
    };

    try {
      await axios.post(`${API_BASE_URL}/goals/add`, newGoal);
      toast.success("Goal created successfully! 🎯");
      setGoals((prev) => [...prev, newGoal]);
      setNewGoalName("");
      setNewGoalTarget("");
      setOpen(false);
    } catch (err) {
      console.error("Error creating goal:", err);
      toast.error("Failed to save goal!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 animate-fade-in max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Goals</h1>
            <p className="text-muted-foreground">Track your eco-friendly targets</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="eco-gradient">
                <Plus className="h-5 w-5 mr-2" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-name">Goal Description</Label>
                  <Input
                    id="goal-name"
                    placeholder="e.g., Reduce 20 kg CO₂ this month"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-target">Target Value</Label>
                  <Input
                    id="goal-target"
                    type="number"
                    placeholder="e.g., 20"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateGoal} className="w-full eco-gradient">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {goals.map((goal) => {
            const progressPercent = (goal.progress / goal.targetValue) * 100;

            return (
              <Card key={goal.id} className="transition-smooth">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      {goal.target}
                    </div>
                    <span className="text-sm font-normal text-muted-foreground">
                      {goal.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {goal.progress} / {goal.targetValue}
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-3" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      {progressPercent.toFixed(0)}% complete
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Activity History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No activities logged yet. Start tracking to see your history!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Activity Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Emission (kg CO₂)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {activity.type === "Car Travel" && "🚗"}
                              {activity.type === "Electricity Usage" && "⚡"}
                              {activity.type === "Food Consumption" && "🍔"}
                              {activity.type === "Flight Travel" && "✈️"}
                              {activity.type === "Bike/Walk" && "🚲"}
                            </span>
                            <span>{activity.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {activity.type === "Car Travel" && `${activity.distance} km, ${activity.mileage} km/l, ${activity.fuel}`}
                          {activity.type === "Electricity Usage" && `${activity.units} kWh`}
                          {activity.type === "Food Consumption" && activity.dietType}
                          {activity.type === "Flight Travel" && `${activity.distance} km`}
                          {activity.type === "Bike/Walk" && "Eco-friendly transport"}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          {activity.emission?.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Goals;
