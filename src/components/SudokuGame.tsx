import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { toast } from "sonner";

// Simple Sudoku puzzle (0 represents empty cells)
const initialPuzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

export const SudokuGame = () => {
  const [puzzle, setPuzzle] = useState(initialPuzzle.map(row => [...row]));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const handleCellClick = (row: number, col: number) => {
    if (initialPuzzle[row][col] === 0) {
      setSelectedCell([row, col]);
    }
  };

  const handleNumberInput = (num: number) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      const newPuzzle = puzzle.map(r => [...r]);
      newPuzzle[row][col] = num;
      setPuzzle(newPuzzle);
    }
  };

  const handleReset = () => {
    setPuzzle(initialPuzzle.map(row => [...row]));
    setSelectedCell(null);
    toast.success("Sudoku puzzle reset");
  };

  const handleClear = () => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      const newPuzzle = puzzle.map(r => [...r]);
      newPuzzle[row][col] = 0;
      setPuzzle(newPuzzle);
    }
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Sudoku</h3>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-9 gap-0 w-fit mx-auto border-2 border-border">
          {puzzle.map((row, rowIndex) => (
            row.map((cell, colIndex) => {
              const isInitial = initialPuzzle[rowIndex][colIndex] !== 0;
              const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
              const isThickRight = (colIndex + 1) % 3 === 0 && colIndex !== 8;
              const isThickBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`
                    w-8 h-8 text-sm flex items-center justify-center
                    ${isInitial ? 'bg-muted font-bold text-foreground' : 'bg-background text-primary hover:bg-accent'}
                    ${isSelected ? 'ring-2 ring-primary ring-inset' : ''}
                    ${isThickRight ? 'border-r-2 border-border' : 'border-r border-border/50'}
                    ${isThickBottom ? 'border-b-2 border-border' : 'border-b border-border/50'}
                    transition-colors
                  `}
                  disabled={isInitial}
                >
                  {cell !== 0 ? cell : ''}
                </button>
              );
            })
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            onClick={() => handleNumberInput(num)}
            variant="outline"
            size="sm"
            disabled={!selectedCell}
            className="w-10 h-10"
          >
            {num}
          </Button>
        ))}
      </div>

      <div className="flex gap-2 justify-center">
        <Button onClick={handleClear} variant="outline" size="sm" disabled={!selectedCell}>
          Clear
        </Button>
        <Button onClick={handleReset} variant="outline" size="sm">
          Reset
        </Button>
      </div>
    </Card>
  );
};
