import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Plus, Home } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer hover-elevate p-2 rounded-lg" data-testid="nav-logo-trigger">
              <Home className="h-6 w-6 text-emerald-500" />
              <h2 className="text-xl font-semibold text-neutral-100">
                Diamond Cut Landscape
              </h2>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-48 p-2" side="bottom" align="start">
            <div className="flex flex-col gap-1">
              <Link href="/">
                <Button 
                  variant={location === "/" ? "default" : "ghost"}
                  className="w-full justify-start flex items-center gap-2"
                  data-testid="nav-dashboard"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              
              <Link href="/data-input">
                <Button 
                  variant={location === "/data-input" ? "default" : "ghost"}
                  className="w-full justify-start flex items-center gap-2"
                  data-testid="nav-data-input"
                >
                  <Plus className="h-4 w-4" />
                  Data Entry
                </Button>
              </Link>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </Card>
  );
}