import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useTodo } from "@/contexts/TodoContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

const TodoList = () => {
  const { todos, toggleTodo, removeTodo } = useTodo();
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const handleToggle = (id: string, currentCompleted: boolean) => {
    if (!currentCompleted) {
      toggleTodo(id);
      // Wait for strikethrough animation, then start fade out
      setTimeout(() => {
        setRemovingIds((prev) => new Set(prev).add(id));
        // Remove from list after fade animation
        setTimeout(() => {
          removeTodo(id);
          setRemovingIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, 500);
      }, 300);
    }
  };

  const priorityColors = {
    high: "border-critical/50 bg-critical/5",
    medium: "border-warning/50 bg-warning/5",
    low: "border-primary/50 bg-primary/5",
  };

  const priorityBadge = {
    high: "bg-critical/20 text-critical border-critical/30",
    medium: "bg-warning/20 text-warning border-warning/30",
    low: "bg-primary/20 text-primary border-primary/30",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">My To-Do List</h1>
            <p className="text-muted-foreground">
              Track your health reminders and wellness tasks
            </p>
          </div>

          {todos.length === 0 ? (
            <div className="text-center py-16">
              <Circle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No tasks yet
              </h3>
              <p className="text-muted-foreground">
                Add health reminders from the home page to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`
                    p-5 rounded-lg border-2 shadow-card transition-all duration-500
                    ${priorityColors[todo.priority]}
                    ${removingIds.has(todo.id) ? "opacity-0 scale-95" : "opacity-100 scale-100"}
                    ${todo.completed ? "animate-fade-out" : "animate-slide-in"}
                  `}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggle(todo.id, todo.completed)}
                      className="mt-1 flex-shrink-0"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3
                          className={`font-semibold text-foreground transition-all duration-300 ${
                            todo.completed ? "line-through opacity-50" : ""
                          }`}
                        >
                          {todo.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`${priorityBadge[todo.priority]} text-xs`}
                        >
                          {todo.priority}
                        </Badge>
                      </div>
                      <p
                        className={`text-sm text-muted-foreground transition-all duration-300 ${
                          todo.completed ? "line-through opacity-50" : ""
                        }`}
                      >
                        {todo.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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

export default TodoList;
