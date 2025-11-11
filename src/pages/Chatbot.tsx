import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatHistory } from "@/lib/mockData";
import { Send, Bot, User } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  message: string;
  timestamp: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>(chatHistory);
  const [input, setInput] = useState("");

  const mockResponses = [
    "Try using public transport twice a week. Estimated reduction: 3.5 kg CO₂.",
    "Consider carpooling with colleagues. You could save 5 kg CO₂ per week!",
    "Plant-based meals 3 times a week can reduce your footprint by 2 kg.",
    "Using a reusable water bottle saves approximately 1 kg CO₂ monthly.",
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      sender: "user",
      message: input,
      timestamp: new Date().toISOString()
    };

    const botResponse: Message = {
      sender: "bot",
      message: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage, botResponse]);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background select-none">
      <Navbar />
      <main className="container py-8 animate-fade-in max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">EcoBot Assistant</h1>
          <p className="text-muted-foreground">Ask me anything about reducing your carbon footprint</p>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary animate-glow" />
              Chat
            </CardTitle>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 animate-fade-in ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.sender === "user"
                        ? "eco-gradient text-white"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-secondary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <CardContent className="border-t p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about reducing emissions..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleSend} className="eco-gradient">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Chatbot;
