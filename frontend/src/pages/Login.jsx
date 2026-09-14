import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogIn, Sun, Moon } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative' }}>
      {/* Theme toggle */}
      <button onClick={toggleTheme} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--color-border)', border: 'none', borderRadius: '999px', padding: '0.5rem', cursor: 'pointer', display: 'flex', color: 'var(--color-text)' }}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="AURA Logo" style={{ width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 1rem', boxShadow: 'var(--shadow-glow)', objectFit: 'cover', display: 'block' }} />
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.25rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Sign in to access AURA</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '0.625rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>Email</label>
            <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            <LogIn size={17} /> {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
