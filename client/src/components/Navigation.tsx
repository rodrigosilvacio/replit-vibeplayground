import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Grid3X3, Info } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Playground", icon: Home },
    { path: "/gallery", label: "Gallery", icon: Grid3X3 },
    { path: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="fixed top-4 right-4 z-50 flex gap-2 bg-background/80 backdrop-blur-md p-2 rounded-xl border border-border shadow-lg">
      {navItems.map((item) => {
        const isActive = location === item.path;
        return (
          <Link key={item.path} href={item.path}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className="gap-2"
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
