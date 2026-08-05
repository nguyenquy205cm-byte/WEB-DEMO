import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-[1300px] px-4 py-6 md:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
