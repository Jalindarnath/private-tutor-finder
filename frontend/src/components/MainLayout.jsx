import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar pb-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
