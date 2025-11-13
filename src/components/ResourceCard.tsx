import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface ResourceCardProps {
  title: string;
  summary: string;
  content: string;
  link?: string;
}

export const ResourceCard = ({ title, summary, content, link }: ResourceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-5 shadow-card hover:shadow-elevated transition-all border-border">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-3">{summary}</p>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border animate-slide-in">
          <p className="text-sm text-foreground mb-4">{content}</p>
          {link && (
            <Button variant="outline" size="sm" asChild>
              <a href={link} target="_blank" rel="noopener noreferrer">
                Learn More
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
