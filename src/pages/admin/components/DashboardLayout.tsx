import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Building2, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  ChevronLeft,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Overview", href: "/", icon: BarChart3 },
  { name: "Properties", href: "/properties", icon: Building2 },
  { name: "Reviews", href: "/reviews", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg flex">
      {/* Sidebar */}
      <div className={cn(
        "bg-brand-green-400 border-r border-brand-grey-300 transition-all duration-300 animate-slide-in",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        <div className="flex h-16 items-center justify-between px-4">
          <div className={cn(
            "flex items-center space-x-2 transition-opacity duration-300",
            !sidebarOpen && "opacity-0"
          )}>
            <Building2 className="h-8 w-8 text-white animate-pop-in" />
            <span className="text-xl font-bold text-white">FlexiManager</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8 p-0 text-white hover:bg-brand-green-500 hover:text-white"
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform duration-200",
              !sidebarOpen && "rotate-180"
            )} />
          </Button>
        </div>
        
        <nav className="mt-8 px-3">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 animate-fade-up",
                      active
                        ? "bg-white text-brand-green-500 shadow-brand-card"
                        : "text-white/80 hover:text-white hover:bg-brand-green-500"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-hero border-b border-border h-16 flex items-center justify-between px-6 shadow-brand-card">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 p-0 lg:hidden text-brand-green-500 hover:bg-brand-green-100"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold text-foreground animate-fade-up">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground animate-slide-in">
              Welcome back, Manager
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 animate-fade-up">
          {children}
        </main>
      </div>
    </div>
  );
}