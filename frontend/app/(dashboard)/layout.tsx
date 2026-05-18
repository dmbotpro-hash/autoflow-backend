import Sidebar from '../../components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-black text-white">{children}</main>
    </div>
  );
}

