import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);

      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {isMobile ? (
        <>
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setSidebarOpen((open) => !open)}
            style={{
              position: 'fixed',
              top: '1rem',
              left: '1rem',
              zIndex: 60,
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              background: 'rgba(15, 23, 42, 0.75)',
              color: 'var(--color-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-soft)',
              cursor: 'pointer',
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(2, 6, 23, 0.52)',
                zIndex: 45,
              }}
            />
          )}

          <Sidebar isMobile mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
      ) : (
        <Sidebar />
      )}

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? '5rem 1rem 1.5rem' : '2rem',
          width: isMobile ? '100%' : 'auto',
          marginLeft: isMobile ? 0 : undefined,
        }}
        className="main-content"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
