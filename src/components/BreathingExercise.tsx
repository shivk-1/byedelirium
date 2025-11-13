import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

export const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "exhale">("inhale");

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPhase((prev) => (prev === "inhale" ? "exhale" : "inhale"));
    }, 4000);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <Card className="p-8 shadow-card bg-gradient-calm border-border">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">Breathing Exercise</h3>
        <p className="text-sm text-muted-foreground">
          Follow the circle to calm your mind and body
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div
            className={`absolute w-32 h-32 rounded-full bg-primary/30 transition-all duration-[4000ms] ease-in-out ${
              isActive && phase === "inhale" ? "scale-150" : "scale-100"
            }`}
          />
          <div className="absolute w-32 h-32 rounded-full border-2 border-primary/50 flex items-center justify-center">
            <span className="text-lg font-medium text-foreground">
              {isActive ? (phase === "inhale" ? "Inhale..." : "Exhale...") : "Ready"}
            </span>
          </div>
        </div>

        <Button
          onClick={() => setIsActive(!isActive)}
          variant={isActive ? "outline" : "default"}
          className="w-32"
        >
          {isActive ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
