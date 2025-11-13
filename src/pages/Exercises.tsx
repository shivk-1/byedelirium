import { Header } from "@/components/Header";
import { BreathingExercise } from "@/components/BreathingExercise";
import { SudokuGame } from "@/components/SudokuGame";
import { WordSearchGame } from "@/components/WordSearchGame";

const Exercises = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={true} />

      <main className="container mx-auto px-4 py-8 space-y-12">
        <section className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Wellness Exercises</h1>
            <p className="text-muted-foreground">Engage your mind and body with calming activities</p>
          </div>

          {/* Breathing Exercise */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Breathing Exercise</h2>
            <BreathingExercise />
          </div>

          {/* Mind Exercises */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Mind Exercises</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SudokuGame />
              <WordSearchGame />
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 py-8 bg-gradient-calm border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Developed by Team ByeDelirium
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Exercises;
