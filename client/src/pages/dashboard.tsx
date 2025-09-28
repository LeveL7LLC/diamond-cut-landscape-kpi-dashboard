import Dashboard from '@/components/Dashboard';
import Navigation from '@/components/Navigation';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <Navigation />
      <Dashboard />
    </div>
  );
}