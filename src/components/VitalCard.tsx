import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface VitalCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  unit: string;
  status: "normal" | "warning" | "critical";
  sparklineData?: number[];
}

const statusColors = {
  normal: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  critical: "bg-critical/10 text-critical border-critical/20",
};

const statusLabels = {
  normal: "Normal",
  warning: "Warning",
  critical: "Critical",
};

export const VitalCard = ({
  icon: Icon,
  title,
  value,
  unit,
  status,
  sparklineData = [],
}: VitalCardProps) => {
  const maxValue = Math.max(...sparklineData, 1);

  return (
    <Card className="p-6 shadow-card hover:shadow-elevated transition-all duration-300 border-border bg-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-foreground">{value}</span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[status]}`}
        >
          {statusLabels[status]}
        </span>
      </div>

      {sparklineData.length > 0 && (
        <div className="h-12 flex items-end gap-0.5">
          {sparklineData.map((point, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/20 rounded-t transition-all"
              style={{ height: `${(point / maxValue) * 100}%` }}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
