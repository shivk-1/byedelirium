import { Activity } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { ProfileDropdown } from "@/components/ProfileDropdown";

interface HeaderProps {
  isConnected: boolean;
}

export const Header = ({ isConnected }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSectionClick = (sectionId: string) => {
    if (location.pathname !== "/") {
      // Navigate to home page with hash
      navigate(`/#${sectionId}`);
      // Wait for navigation, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold text-foreground">ByeDelirium</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground"
          >
            Home
          </NavLink>
          <NavLink
            to="/exercises"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground"
          >
            Exercises
          </NavLink>
          <NavLink
            to="/todo"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            activeClassName="text-foreground"
          >
            To-Do List
          </NavLink>
          <button
            onClick={() => handleSectionClick("resources")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Resources
          </button>
          <button
            onClick={() => handleSectionClick("help")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Get Help
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-success animate-pulse-soft" : "bg-critical"
              }`}
            />
            <span className="text-sm text-muted-foreground">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
