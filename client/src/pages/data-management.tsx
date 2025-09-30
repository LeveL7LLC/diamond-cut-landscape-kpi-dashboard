import Navigation from "@/components/Navigation";
import DataManagement from "@/components/DataManagement";

export default function DataManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <Navigation />
        <DataManagement />
      </div>
    </div>
  );
}