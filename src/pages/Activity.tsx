import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { activityTypes, emissionFactors } from "@/lib/mockData";
import { Calculator, Sparkles, Plus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios"; // ✅ added for backend calls

const Activity = () => {
  const [selectedActivity, setSelectedActivity] = useState("");
  const [distance, setDistance] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelType, setFuelType] = useState("petrol");
  const [electricity, setElectricity] = useState("");
  const [dietType, setDietType] = useState("mixed");
  const [flightDistance, setFlightDistance] = useState("");
  const [calculatedEmission, setCalculatedEmission] = useState<number | null>(null);
  const [currentActivityType, setCurrentActivityType] = useState("");

  const API_BASE_URL = "http://localhost:5000/api"; // ✅ your backend base URL

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) setter(value);
  };

  const calculateEmission = () => {
    if (!selectedActivity) {
      toast.error("Please select an activity type");
      return;
    }

    let emission = 0;
    let activityType = "";

    if (selectedActivity === "car") {
      const dist = parseFloat(distance);
      const mil = parseFloat(mileage);
      if (!dist || !mil || dist <= 0 || mil <= 0) {
        toast.error("Please enter valid positive distance and mileage");
        return;
      }
      const factor = fuelType === "petrol" ? emissionFactors.petrol : emissionFactors.diesel;
      emission = (dist / mil) * factor;
      activityType = "Car Travel";
    } else if (selectedActivity === "electricity") {
      const kWh = parseFloat(electricity);
      if (!kWh || kWh <= 0) {
        toast.error("Please enter valid electricity consumption");
        return;
      }
      emission = kWh * emissionFactors.electricity;
      activityType = "Electricity Usage";
    } else if (selectedActivity === "food") {
      const dietEmissions = { vegetarian: 3.8, mixed: 5.6, nonVegetarian: 7.2 };
      emission = dietEmissions[dietType as keyof typeof dietEmissions];
      activityType = "Food Consumption";
    } else if (selectedActivity === "flight") {
      const dist = parseFloat(flightDistance);
      if (!dist || dist <= 0) {
        toast.error("Please enter valid flight distance");
        return;
      }
      emission = dist * emissionFactors.flight;
      activityType = "Flight Travel";
    } else if (selectedActivity === "bike") {
      emission = 0;
      activityType = "Bike/Walk";
      toast.success("Great choice! Zero emissions!");
    }

    setCalculatedEmission(emission);
    setCurrentActivityType(activityType);
    toast.success("Emission calculated successfully!");
  };

  const addToDashboard = async () => {
    if (calculatedEmission === null) return;

    const newActivity = {
      type: currentActivityType,
      emission: calculatedEmission,
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString(),
      ...(selectedActivity === "car" && { distance, mileage, fuel: fuelType }),
      ...(selectedActivity === "electricity" && { units: electricity }),
      ...(selectedActivity === "food" && { dietType }),
      ...(selectedActivity === "flight" && { distance: flightDistance }),
    };

    try {
      // ✅ send to backend
      await axios.post(`${API_BASE_URL}/activities/add`, newActivity);
      toast.success("Activity saved to backend!");
    } catch (error) {
      console.error("Error saving activity:", error);
      toast.error("Failed to save activity!");
    }

    // Reset
    setSelectedActivity("");
    setDistance("");
    setMileage("");
    setElectricity("");
    setFlightDistance("");
    setCalculatedEmission(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 animate-fade-in max-w-2xl select-none">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Log Your Activity</h1>
          <p className="text-muted-foreground">Track your carbon emissions from daily activities</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Activity Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Activity Type</Label>
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an activity" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedActivity === "car" && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (km)</Label>
                    <Input
                      id="distance"
                      type="text"
                      inputMode="decimal"
                      placeholder="e.g., 20"
                      value={distance}
                      onChange={(e) => handleNumberInput(e, setDistance)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage (km/l)</Label>
                    <Input
                      id="mileage"
                      type="text"
                      inputMode="decimal"
                      placeholder="e.g., 15"
                      value={mileage}
                      onChange={(e) => handleNumberInput(e, setMileage)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fuel Type</Label>
                  <Select value={fuelType} onValueChange={setFuelType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {selectedActivity === "electricity" && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="electricity">Electricity Consumed (kWh)</Label>
                  <Input
                    id="electricity"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g., 50"
                    value={electricity}
                    onChange={(e) => handleNumberInput(e, setElectricity)}
                  />
                </div>
              </div>
            )}

            {selectedActivity === "food" && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Diet Type</Label>
                  <Select value={dietType} onValueChange={setDietType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian (3.8 kg CO₂/day)</SelectItem>
                      <SelectItem value="mixed">Mixed Diet (5.6 kg CO₂/day)</SelectItem>
                      <SelectItem value="nonVegetarian">Non-Vegetarian (7.2 kg CO₂/day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {selectedActivity === "flight" && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="flightDistance">Flight Distance (km)</Label>
                  <Input
                    id="flightDistance"
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g., 1500"
                    value={flightDistance}
                    onChange={(e) => handleNumberInput(e, setFlightDistance)}
                  />
                </div>
              </div>
            )}

            {selectedActivity === "bike" && (
              <div className="p-4 bg-success/10 rounded-lg text-center animate-fade-in">
                <p className="text-success font-medium">
                  Excellent choice! Walking and cycling produce zero emissions.
                </p>
              </div>
            )}

            <Button onClick={calculateEmission} className="w-full eco-gradient" size="lg">
              <Calculator className="h-5 w-5 mr-2" />
              Calculate Emission
            </Button>
          </CardContent>
        </Card>

        {calculatedEmission !== null && (
          <Card className="animate-scale-in eco-gradient">
            <CardContent className="pt-6">
              <div className="text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-white animate-glow" />
                <h3 className="text-lg font-medium text-white mb-2">Estimated CO₂ Emission</h3>
                <div className="text-5xl font-bold text-white mb-2">
                  {calculatedEmission.toFixed(2)}
                </div>
                <p className="text-white/90 mb-4">kg CO₂e</p>
                <Button
                  onClick={addToDashboard}
                  className="bg-white text-primary hover:bg-white/90"
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Activity;
