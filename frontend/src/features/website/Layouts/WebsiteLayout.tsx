
import { Footer } from './Footer';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';


const WebsiteLayout = () => {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default WebsiteLayout;