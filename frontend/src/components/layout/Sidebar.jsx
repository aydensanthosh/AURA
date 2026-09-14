import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  CheckSquare,
  Repeat,
  Wallet,
  FileText,
  Dumbbell,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/habits', icon: Repeat, label: 'Habits' },
  { path: '/expenses', icon: Wallet, label: 'Finances' },
  { path: '/notes', icon: FileText, label: 'Notes' },
  { path: '/workouts', icon: Dumbbell, label: 'Workouts' },
];

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      style={{
        width: '240px',
        flexShrink: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-surface)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/logo.png"
            alt="AURA Logo"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-glow)',
              objectFit: 'cover',
            }}
          />
          <div style={{ fontWeight: 800, fontSize: '3rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            AURA
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0.75rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(({ path, icon: Icon, label, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.875rem',
                borderRadius: '0.6rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(236,72,153,0.08))'
                  : 'transparent',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                transition: 'all 0.18s ease',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', marginBottom: '0.5rem', background: 'var(--color-bg-2)', borderRadius: '0.75rem' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name}
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 0.875rem',
            borderRadius: '0.6rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
            width: '100%',
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-border)';
            e.currentTarget.style.color = 'var(--color-text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--color-text-muted)';
          }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 0.875rem',
            borderRadius: '0.6rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
            width: '100%',
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            e.currentTarget.style.color = 'var(--color-danger)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--color-text-muted)';
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
