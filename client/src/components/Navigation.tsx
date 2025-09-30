import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Plus, Home, Database } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Handle hover behavior for desktop
  useEffect(() => {
    let hoverTimeout: NodeJS.Timeout;
    
    if (isHovered) {
      setIsOpen(true);
    } else {
      // Delay closing to allow moving to the popover content
      hoverTimeout = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }

    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div 
              className="flex items-center gap-2 cursor-pointer hover-elevate p-2 rounded-lg" 
              data-testid="nav-logo-trigger"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            >
              <Home className="h-6 w-6 text-emerald-500" />
              <h2 className="text-xl font-semibold text-neutral-100">
                Diamond Cut Landscape
              </h2>
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="w-48 p-2 bg-neutral-900 border-neutral-700 text-white" 
            side="bottom" 
            align="start"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex flex-col gap-1">
              <Link href="/">
                <Button 
                  variant={location === "/" ? "default" : "ghost"}
                  className="w-full justify-start flex items-center gap-2 hover:bg-emerald-500/20 hover:text-emerald-100"
                  data-testid="nav-dashboard"
                  onClick={handleLinkClick}
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              
              <Link href="/data-input">
                <Button 
                  variant={location === "/data-input" ? "default" : "ghost"}
                  className="w-full justify-start flex items-center gap-2 hover:bg-emerald-500/20 hover:text-emerald-100"
                  data-testid="nav-data-input"
                  onClick={handleLinkClick}
                >
                  <Plus className="h-4 w-4" />
                  Data Entry
                </Button>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </Card>
  );
}