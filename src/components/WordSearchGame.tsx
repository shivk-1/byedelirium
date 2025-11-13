import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";

const grid = [
  ['R', 'E', 'L', 'A', 'X', 'T', 'H', 'I', 'N', 'K'],
  ['M', 'I', 'N', 'D', 'F', 'U', 'L', 'P', 'E', 'A'],
  ['C', 'A', 'L', 'M', 'G', 'H', 'E', 'A', 'C', 'L'],
  ['B', 'R', 'E', 'A', 'T', 'H', 'E', 'L', 'T', 'M'],
  ['F', 'O', 'C', 'U', 'S', 'K', 'J', 'T', 'A', 'N'],
  ['S', 'L', 'E', 'E', 'P', 'M', 'N', 'H', 'R', 'U'],
  ['T', 'R', 'A', 'N', 'Q', 'U', 'I', 'L', 'I', 'R'],
  ['M', 'E', 'D', 'I', 'T', 'A', 'T', 'E', 'T', 'S'],
  ['W', 'E', 'L', 'L', 'N', 'E', 'S', 'S', 'Y', 'E'],
  ['R', 'E', 'S', 'T', 'O', 'R', 'E', 'Q', 'U', 'I'],
];

const words = ['RELAX', 'MINDFUL', 'CALM', 'BREATHE', 'FOCUS', 'SLEEP', 'TRANQUIL', 'MEDITATE', 'WELLNESS', 'RESTORE', 'HEALTH', 'PEACE', 'CLARITY', 'THINK', 'REST'];

interface Cell {
  row: number;
  col: number;
}

export const WordSearchGame = () => {
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [shake, setShake] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setFoundWords([]);
    setSelectedCells([]);
    toast.success("Word search reset");
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const getSelectedWord = () => {
    return selectedCells.map(cell => grid[cell.row][cell.col]).join('');
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    setSelectedCells([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isDragging) return;

    const lastCell = selectedCells[selectedCells.length - 1];
    if (!lastCell) return;

    // Check if this is a valid continuation (horizontal, vertical, or diagonal)
    const rowDiff = Math.abs(row - selectedCells[0].row);
    const colDiff = Math.abs(col - selectedCells[0].col);
    
    // Must be in a straight line (same row, same col, or diagonal)
    const isHorizontal = rowDiff === 0;
    const isVertical = colDiff === 0;
    const isDiagonal = rowDiff === colDiff;
    
    if (isHorizontal || isVertical || isDiagonal) {
      // Don't add if already selected
      if (!isCellSelected(row, col)) {
        setSelectedCells(prev => [...prev, { row, col }]);
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const selectedWord = getSelectedWord();
    
    // Check if the word exists in our word list
    if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      setFoundWords(prev => [...prev, selectedWord]);
      toast.success(`Word found: ${selectedWord}!`);
    } else if (selectedCells.length > 1) {
      // Wrong word - shake animation
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    setSelectedCells([]);
  };

  const handleTouchStart = (e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault();
    handleMouseDown(row, col);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging || !gridRef.current) return;

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.hasAttribute('data-cell')) {
      const row = parseInt(element.getAttribute('data-row') || '0');
      const col = parseInt(element.getAttribute('data-col') || '0');
      handleMouseEnter(row, col);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseUp();
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
        <div 
          ref={gridRef}
          className={`grid grid-cols-10 gap-1 w-fit mx-auto select-none ${shake ? 'animate-shake' : ''}`}
          onMouseLeave={handleMouseUp}
        >
          {grid.map((row, rowIndex) => (
            row.map((letter, colIndex) => {
              const isSelected = isCellSelected(rowIndex, colIndex);
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  data-cell="true"
                  data-row={rowIndex}
                  data-col={colIndex}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
                  onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className={`
                    w-8 h-8 flex items-center justify-center text-sm font-semibold rounded border cursor-pointer transition-all
                    ${isSelected 
                      ? 'bg-primary text-primary-foreground border-primary scale-110' 
                      : 'bg-muted text-foreground border-border/50 hover:bg-accent'
                    }
                  `}
                >
                  {letter}
                </div>
              );
            })
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Find these words:</p>
        <div className="flex flex-wrap gap-2">
          {words.map((word) => (
            <div
              key={word}
              className={`
                px-3 py-1 text-xs rounded-full border transition-colors
                ${foundWords.includes(word)
                  ? 'bg-success/20 border-success text-success-foreground line-through'
                  : 'bg-background border-border text-foreground'
                }
              `}
            >
              {word}
            </div>
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

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </Card>
  );
};
