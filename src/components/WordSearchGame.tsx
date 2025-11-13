import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";

const grid = [
  ['R', 'E', 'L', 'A', 'X', 'T', 'H', 'I', 'N', 'K'],
  ['M', 'I', 'N', 'D', 'F', 'U', 'L', 'P', 'E', 'A'],
  ['C', 'A', 'L', 'M', 'G', 'H', 'E', 'A', 'C', 'L'],
  ['B', 'R', 'E', 'A', 'T', 'H', 'E', 'L', 'E', 'M'],
  ['F', 'O', 'C', 'U', 'S', 'K', 'J', 'T', 'A', 'N'],
  ['S', 'L', 'E', 'E', 'P', 'M', 'N', 'H', 'R', 'U'],
  ['T', 'R', 'A', 'N', 'Q', 'U', 'I', 'L', 'I', 'R'],
  ['M', 'E', 'D', 'I', 'T', 'A', 'T', 'E', 'T', 'S'],
  ['W', 'E', 'L', 'L', 'N', 'E', 'S', 'S', 'Y', 'E'],
  ['R', 'E', 'S', 'T', 'O', 'R', 'E', 'Q', 'U', 'I'],
];

const words = ['RELAX', 'MINDFUL', 'CALM', 'BREATHE', 'FOCUS', 'SLEEP', 'TRANQUIL', 'MEDITATE', 'WELLNESS', 'RESTORE', 'HEALTH', 'PEACE', 'CLARITY', 'THINK', 'REST'];

export const WordSearchGame = () => {
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  const handleReset = () => {
    setFoundWords([]);
    setSelectedCells(new Set());
    toast.success("Word search reset");
  };

  const handleWordClick = (word: string) => {
    if (!foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
      toast.success(`Found: ${word}`);
    }
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Word Search</h3>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-10 gap-1 w-fit mx-auto">
          {grid.map((row, rowIndex) => (
            row.map((letter, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-8 h-8 flex items-center justify-center bg-muted text-foreground text-sm font-semibold rounded border border-border/50"
              >
                {letter}
              </div>
            ))
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Find these words:</p>
        <div className="flex flex-wrap gap-2">
          {words.map((word) => (
            <button
              key={word}
              onClick={() => handleWordClick(word)}
              className={`
                px-3 py-1 text-xs rounded-full border transition-colors
                ${foundWords.includes(word)
                  ? 'bg-success/20 border-success text-success-foreground line-through'
                  : 'bg-background border-border text-foreground hover:bg-accent'
                }
              `}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleReset} variant="outline" size="sm">
          Reset
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Found {foundWords.length} of {words.length} words
        </p>
      </div>
    </Card>
  );
};
