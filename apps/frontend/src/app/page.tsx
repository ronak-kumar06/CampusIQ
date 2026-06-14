import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import AiDrawer from '@/components/AiDrawer';

export default function Home() {
  return (
    <main className="flex-grow flex flex-col relative pb-20">
      <Navbar />
      <Dashboard />
      <AiDrawer />
    </main>
  );
}
