import { useState } from "react";
import { Header } from "@/components/Header";
import { useTodo } from "@/contexts/TodoContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Circle, Plus, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  todo: {
    id: string;
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    completed: boolean;
  };
  onToggle: (id: string, completed: boolean) => void;
  isRemoving: boolean;
  priorityColors: Record<string, string>;
  priorityBadge: Record<string, string>;
}

const SortableItem = ({ id, todo, onToggle, isRemoving, priorityColors, priorityBadge }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        p-5 rounded-lg border-2 shadow-card transition-all duration-500
        ${priorityColors[todo.priority]}
        ${isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"}
        ${todo.completed ? "animate-fade-out" : "animate-slide-in"}
      `}
    >
      <div className="flex items-start gap-4">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
        
        <button
          onClick={() => onToggle(todo.id, todo.completed)}
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
  );
};

const TodoList = () => {
  const { todos, toggleTodo, removeTodo, addTodo, reorderTodos } = useTodo();
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);
      const newOrder = arrayMove(todos, oldIndex, newIndex);
      reorderTodos(newOrder);
    }
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    
    addTodo(
      newTaskTitle,
      newTaskDescription || "Custom task",
      newTaskPriority
    );
    
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("medium");
    toast.success("Task added to your list");
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

          {/* Add Task Form */}
          <div className="mb-8 p-6 bg-muted/30 rounded-lg border-2 border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Add New Task</h2>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="mb-2"
                />
                <Input
                  placeholder="Description (optional)..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Priority:</span>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setNewTaskPriority(priority)}
                      className={`
                        px-3 py-1 text-xs rounded-full border-2 transition-all
                        ${newTaskPriority === priority
                          ? priorityBadge[priority]
                          : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                        }
                      `}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleAddTask} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={todos.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {todos.map((todo) => (
                    <SortableItem
                      key={todo.id}
                      id={todo.id}
                      todo={todo}
                      onToggle={handleToggle}
                      isRemoving={removingIds.has(todo.id)}
                      priorityColors={priorityColors}
                      priorityBadge={priorityBadge}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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
