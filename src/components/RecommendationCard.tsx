import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface RecommendationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  priority: "high" | "medium" | "low";
}

const priorityStyles = {
  high: "border-critical/30 bg-critical/5",
  medium: "border-warning/30 bg-warning/5",
  low: "border-primary/30 bg-primary/5",
};

export const RecommendationCard = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  priority,
}: RecommendationCardProps) => {
  return (
    <Card className={`p-5 border-2 ${priorityStyles[priority]} shadow-card animate-slide-in`}>
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <Button onClick={onAction} variant="outline" size="sm">
            {actionLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
};
