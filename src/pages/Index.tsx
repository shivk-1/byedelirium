import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { VitalCard } from "@/components/VitalCard";
import { StatusBar } from "@/components/StatusBar";
import { RecommendationCard } from "@/components/RecommendationCard";
import { ResourceCard } from "@/components/ResourceCard";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Sun,
  Volume2,
  Thermometer,
  Wind,
  Droplets,
  Brain,
  Bed,
  Phone,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

// Mock data generator
const generateSparkline = () => {
  return Array.from({ length: 20 }, () => Math.random() * 100);
};

const Index = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [vitals, setVitals] = useState({
    bpm: 76,
    light: 350,
    sound: 45,
    temp: 23.5,
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals({
        bpm: 70 + Math.random() * 20,
        light: 300 + Math.random() * 400,
        sound: 40 + Math.random() * 30,
        temp: 22 + Math.random() * 4,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getVitalStatus = (vital: string, value: number): "normal" | "warning" | "critical" => {
    switch (vital) {
      case "bpm":
        if (value < 50 || value > 100) return "critical";
        if (value < 60 || value > 90) return "warning";
        return "normal";
      case "light":
        if (value > 700) return "warning";
        return "normal";
      case "sound":
        if (value > 60) return "warning";
        if (value > 70) return "critical";
        return "normal";
      case "temp":
        if (value > 28 || value < 18) return "critical";
        if (value > 26 || value < 20) return "warning";
        return "normal";
      default:
        return "normal";
    }
  };

  const getOverallStatus = (): "stable" | "at-risk" | "critical" => {
    const statuses = [
      getVitalStatus("bpm", vitals.bpm),
      getVitalStatus("light", vitals.light),
      getVitalStatus("sound", vitals.sound),
      getVitalStatus("temp", vitals.temp),
    ];

    if (statuses.includes("critical")) return "critical";
    if (statuses.includes("warning")) return "at-risk";
    return "stable";
  };

  const handleEmergency = () => {
    toast.error("Emergency alert sent to medical staff", {
      description: "Help is on the way",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={isConnected} />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Vitals Dashboard */}
        <section id="vitals" className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Patient Vitals Monitor</h1>
            <p className="text-muted-foreground">Real-time health and environmental tracking</p>
          </div>

          <StatusBar status={getOverallStatus()} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <VitalCard
              icon={Heart}
              title="Heart Rate"
              value={Math.round(vitals.bpm)}
              unit="BPM"
              status={getVitalStatus("bpm", vitals.bpm)}
              sparklineData={generateSparkline()}
            />
            <VitalCard
              icon={Sun}
              title="Light Level"
              value={Math.round(vitals.light)}
              unit="lux"
              status={getVitalStatus("light", vitals.light)}
              sparklineData={generateSparkline()}
            />
            <VitalCard
              icon={Volume2}
              title="Sound Level"
              value={Math.round(vitals.sound)}
              unit="dB"
              status={getVitalStatus("sound", vitals.sound)}
              sparklineData={generateSparkline()}
            />
            <VitalCard
              icon={Thermometer}
              title="Temperature"
              value={vitals.temp.toFixed(1)}
              unit="°C"
              status={getVitalStatus("temp", vitals.temp)}
              sparklineData={generateSparkline()}
            />
          </div>
        </section>

        {/* Recommendations */}
        <section id="recommendations" className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">My Health Reminders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RecommendationCard
              icon={Wind}
              title="High Heart Rate Detected"
              description="Your heart rate is elevated. Try a breathing exercise to help you relax."
              actionLabel="Add to My To-Do List"
              onAction={() => toast.success("Added to your to-do list")}
              priority="medium"
            />
            <RecommendationCard
              icon={Droplets}
              title="Hydration Reminder"
              description="It's been 2 hours since you last had fluids. Remember to stay hydrated."
              actionLabel="Add to My To-Do List"
              onAction={() => toast.success("Added to your to-do list")}
              priority="low"
            />
          </div>
        </section>

        {/* Resources */}
        <section id="resources" className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Educational Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResourceCard
              title="What is Delirium?"
              summary="Understanding the causes, symptoms, and prevention of hospital-induced delirium."
              content="Delirium is an acute change in mental status characterized by confusion, disorientation, and fluctuating consciousness. It's particularly common in elderly patients and can be prevented through proper monitoring and environmental adjustments."
              link="https://www.nia.nih.gov/health/what-delirium"
            />
            <ResourceCard
              title="Tips for Better Sleep in Hospitals"
              summary="Practical strategies to improve sleep quality during hospital stays."
              content="Good sleep is crucial for recovery. Maintain a regular schedule, reduce noise and light pollution, and communicate concerns with nursing staff. Simple adjustments can significantly improve rest quality."
            />
            <ResourceCard
              title="Cognitive Exercises for Mind Clarity"
              summary="Simple mental exercises to maintain cognitive function."
              content="Regular mental stimulation through puzzles, memory games, and conversation helps maintain cognitive sharpness and can reduce delirium risk. Even 10-15 minutes daily can make a difference."
            />
            <ResourceCard
              title="How Nurses Can Help Prevent Delirium"
              summary="Best practices for healthcare providers in delirium prevention."
              content="Regular orientation cues, maintaining day-night cycles, encouraging mobility, and minimizing unnecessary medical interventions are key strategies nurses can employ to prevent delirium."
            />
          </div>
        </section>

        {/* Get Help */}
        <section id="help" className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Need Help?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-lg border-2 border-primary bg-primary/5 shadow-elevated">
              <Phone className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Call for Help</h3>
              <p className="text-muted-foreground mb-4">
                Need assistance? Reach out to nursing staff right away.
              </p>
              <Button className="w-full" onClick={() => toast.success("Help is on the way")}>
                Call Now
              </Button>
            </div>

            <div className="p-8 rounded-lg border-2 border-critical bg-critical/5 shadow-elevated">
              <AlertCircle className="h-12 w-12 text-critical mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Emergency</h3>
              <p className="text-muted-foreground mb-4">
                In case of emergency, send an immediate alert.
              </p>
              <Button variant="destructive" className="w-full" onClick={handleEmergency}>
                Send Emergency Alert
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-16 py-8 bg-gradient-calm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">Developed by Team ByeDelirium</p>
          <p>Helping prevent hospital-induced delirium through smart monitoring</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
