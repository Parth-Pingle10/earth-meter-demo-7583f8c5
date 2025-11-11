import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockRecommendations } from "@/lib/mockData";
import { Lightbulb, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState(mockRecommendations);

  const generateNewTips = () => {
    const shuffled = [...recommendations].sort(() => Math.random() - 0.5);
    setRecommendations(shuffled);
    toast.success("New recommendations generated! ");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 animate-fade-in max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recommendations</h1>
            <p className="text-muted-foreground">AI-powered tips to reduce your carbon footprint</p>
          </div>
          
          <Button onClick={generateNewTips} variant="outline">
            <RefreshCw className="h-5 w-5 mr-2" />
            Generate New Tips
          </Button>
        </div>

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
                      {rec.text.replace(rec.icon, '').trim()}
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
