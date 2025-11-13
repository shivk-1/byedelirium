import { Card } from "@/components/ui/card";

interface StatusBarProps {
  status: "stable" | "at-risk" | "critical";
}

const statusConfig = {
  stable: {
    label: "Stable",
    bgColor: "bg-success/20",
    textColor: "text-success",
    borderColor: "border-success/30",
  },
  "at-risk": {
    label: "At Risk",
    bgColor: "bg-warning/20",
    textColor: "text-warning",
    borderColor: "border-warning/30",
  },
  critical: {
    label: "Critical",
    bgColor: "bg-critical/20",
    textColor: "text-critical",
    borderColor: "border-critical/30",
  },
};

export const StatusBar = ({ status }: StatusBarProps) => {
  const config = statusConfig[status];

  return (
    <Card
      className={`p-6 border-2 ${config.borderColor} ${config.bgColor} shadow-elevated animate-slide-in`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Patient Status</p>
          <h3 className={`text-3xl font-bold ${config.textColor}`}>{config.label}</h3>
        </div>
        <div className={`h-16 w-16 rounded-full ${config.bgColor} flex items-center justify-center`}>
          <div className={`h-8 w-8 rounded-full ${config.textColor.replace('text-', 'bg-')} animate-pulse-soft`} />
        </div>
      </div>
    </Card>
  );
};
