import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface TodoItem {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  createdAt: number;
}

interface TodoContextType {
  todos: TodoItem[];
  addTodo: (title: string, description: string, priority: "high" | "medium" | "low") => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  reorderTodos: (newOrder: TodoItem[]) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem("byedelirium-todos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("byedelirium-todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string, description: string, priority: "high" | "medium" | "low") => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const reorderTodos = (newOrder: TodoItem[]) => {
    setTodos(newOrder);
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, removeTodo, reorderTodos }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within TodoProvider");
  }
  return context;
};
