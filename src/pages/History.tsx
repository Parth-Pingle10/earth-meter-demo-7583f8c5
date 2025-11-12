import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History as HistoryIcon } from "lucide-react";
import axios from "axios"; // ✅ Added axios for backend calls
import { toast } from "sonner"; // optional toast alerts

interface Activity {
  id: number;
  type: string;
  emission: number;
  date: string;
  timestamp: string;
  distance?: string;
  mileage?: string;
  fuel?: string;
  units?: string;
  dietType?: string;
}

const History = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [timeFilter, setTimeFilter] = useState("all");

  const API_BASE_URL = "http://localhost:5000/api"; // ✅ your backend base URL

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/activities/history`);
        setActivities(res.data || []);
        toast.success("Fetched activities from backend ✅");
      } catch (err) {
        console.warn("Backend fetch failed, loading local data:", err);
        const stored = localStorage.getItem("ecotrack-activities");
        if (stored) setActivities(JSON.parse(stored));
      }
    };
    fetchActivities();
  }, []);

  const getFilteredActivities = () => {
    const now = new Date();
    return activities.filter((activity) => {
      if (timeFilter === "all") return true;
      const activityDate = new Date(activity.timestamp || activity.date);
      const diffTime = Math.abs(now.getTime() - activityDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (timeFilter === "1day") return diffDays <= 1;
      if (timeFilter === "7days") return diffDays <= 7;
      if (timeFilter === "30days") return diffDays <= 30;
      return true;
    });
  };

  const filteredActivities = getFilteredActivities();

  const getTotalEmissions = () => {
    return filteredActivities.reduce((sum, activity) => sum + activity.emission, 0);
  };

  const formatDateTime = (timestamp: string, date: string) => {
    if (timestamp) {
      const dt = new Date(timestamp);
      return dt.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 animate-fade-in max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Activity History</h1>
          <p className="text-muted-foreground">View your complete carbon footprint timeline</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Activities</p>
                <p className="text-3xl font-bold text-primary">{filteredActivities.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Emissions</p>
                <p className="text-3xl font-bold text-primary">{getTotalEmissions().toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">kg CO₂</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Average per Activity</p>
                <p className="text-3xl font-bold text-primary">
                  {filteredActivities.length > 0
                    ? (getTotalEmissions() / filteredActivities.length).toFixed(2)
                    : "0.00"}
                </p>
                <p className="text-xs text-muted-foreground">kg CO₂</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HistoryIcon className="h-5 w-5 text-primary" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={timeFilter} onValueChange={setTimeFilter} className="mb-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Time</TabsTrigger>
                <TabsTrigger value="1day">Last Day</TabsTrigger>
                <TabsTrigger value="7days">Last 7 Days</TabsTrigger>
                <TabsTrigger value="30days">Last 30 Days</TabsTrigger>
              </TabsList>
            </Tabs>

            {filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <HistoryIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">
                  {timeFilter === "all"
                    ? "No activities logged yet. Start tracking to see your history!"
                    : `No activities found in the selected time period.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Activity Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Emission (kg CO₂)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">
                          {formatDateTime(activity.timestamp, activity.date)}
                        </TableCell>
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
                          {activity.type === "Car Travel" &&
                            `${activity.distance} km, ${activity.mileage} km/l, ${activity.fuel}`}
                          {activity.type === "Electricity Usage" && `${activity.units} kWh`}
                          {activity.type === "Food Consumption" && activity.dietType}
                          {activity.type === "Flight Travel" && `${activity.distance} km`}
                          {activity.type === "Bike/Walk" && "Eco-friendly transport"}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          {activity.emission.toFixed(2)}
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

export default History;
