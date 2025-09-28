import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Plus, Home } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6 text-emerald-500" />
          <h2 className="text-xl font-semibold text-neutral-100">
            Diamond Cut Landscape
          </h2>
        </div>
        
        <div className="flex gap-2">
          <Link href="/">
            <Button 
              variant={location === "/" ? "default" : "outline"}
              className="flex items-center gap-2"
              data-testid="nav-dashboard"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          
          <Link href="/data-input">
            <Button 
              variant={location === "/data-input" ? "default" : "outline"}
              className="flex items-center gap-2"
              data-testid="nav-data-input"
            >
              <Plus className="h-4 w-4" />
              Data Entry
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}