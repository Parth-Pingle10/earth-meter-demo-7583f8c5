import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/activity", label: "Activities" },
    { path: "/goals", label: "Goals" },
    { path: "/history", label: "History" },
    { path: "/recommendations", label: "Recommendations" },
    { path: "/rewards", label: "Rewards" },
    { path: "/chatbot", label: "Chatbot" },
  ];

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-transparent backdrop-blur-md supports-[backdrop-filter]:bg-background/70 transition-colors duration-300">
      <div className="container flex h-16 items-center justify-between">
        
        {/* 🌿 Logo Section */}
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <img
            src="/logo.ico"
            alt="EcoTrack Logo"
            className="h-8 w-8 rounded-full shadow-sm"
          />
          <span className="text-foreground">EcoTrack</span>
        </Link>

        {/* 🧭 Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant={location.pathname === link.path ? "default" : "ghost"}
                size="sm"
                className="transition-smooth"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* 🌗 Theme Toggle + Logout */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
