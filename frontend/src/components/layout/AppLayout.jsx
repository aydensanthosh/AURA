import { Outlet } from 'react-router-dom';
import Sidebar from "./Sidebar";

const AppLayout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
        }}
        className="main-content"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
